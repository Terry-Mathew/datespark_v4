import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase'; // Import initialized auth and db
import { toast } from 'sonner'; // Using sonner for notifications as seen in other files

// Define the structure for our application's user data, stored in Firestore
interface AppUser {
  uid: string;
  email: string | null;
  name: string;
  isPremium: boolean;
  createdAt: any; // Use serverTimestamp for this
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Fetch additional user data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            // Combine Firebase Auth data and Firestore data
            const appUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDocSnap.data()
            } as AppUser;
            setUser(appUser);
          } else {
            // This case might happen if Firestore doc creation failed during signup
            // Or if user was created directly via Firebase console
            // Handle appropriately - maybe create a default doc or sign out
            console.error("User document not found in Firestore for UID:", firebaseUser.uid);
            // For now, create a minimal user object
            setUser({ 
              uid: firebaseUser.uid, 
              email: firebaseUser.email, 
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User', 
              isPremium: false, // Default value
              createdAt: serverTimestamp() // Or fetch from metadata if needed
            });
            // Consider creating the Firestore doc here if it's missing
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          toast.error("Failed to load user profile.");
          setUser(null); // Ensure user is null if profile fetch fails
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting the user state
      toast.success("Signed in successfully!");
      navigate('/'); // Navigate to home or dashboard after sign in
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(`Sign in failed: ${error.message}`);
      setLoading(false); // Ensure loading is false on error
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Create user document in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        name: name,
        email: email, // Store email in Firestore as well
        isPremium: false, // Default value for new users
        createdAt: serverTimestamp() // Record creation time
      });

      // onAuthStateChanged will handle setting the user state after Firestore doc is potentially read
      toast.success("Account created successfully!");
      navigate('/'); // Navigate to home or dashboard after sign up
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(`Sign up failed: ${error.message}`);
      // Consider deleting the auth user if Firestore write fails to keep things consistent
      setLoading(false); // Ensure loading is false on error
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle setting the user state to null
      toast.success("Signed out successfully!");
      navigate('/'); // Navigate to home after sign out
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error(`Sign out failed: ${error.message}`);
      setLoading(false); // Ensure loading is false on error
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
