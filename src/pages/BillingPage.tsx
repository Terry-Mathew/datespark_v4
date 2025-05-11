import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { CreditCard, Loader2, CheckCircle } from "lucide-react";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { useAuth } from "@/contexts/AuthContext";
import { analytics, getFunctions } from "@/config/firebase";
import { logEvent } from "firebase/analytics";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";

// Define expected response structure from the create order function
interface CreateOrderResponse {
  orderId: string;
}

// Define the structure for Razorpay options
interface RazorpayOptions {
  key: string; // Your Razorpay Key ID
  amount: number; // Amount in paise
  currency: string;
  name: string; // Your business name
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: any;
  theme?: {
    color?: string;
  };
}

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => any;
  }
}

const functions = getFunctions();
const createRazorpayOrderCallable = httpsCallable<
  { amount: number; currency: string }, 
  CreateOrderResponse
>(functions, 'createRazorpayOrder');

const db = getFirestore();

const BillingPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [planId, setPlanId] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<{ amountInPaise: number; name: string } | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // --- Load Razorpay Script --- 
  // Best practice: Load external scripts dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // --- Listen to User's Premium Status --- 
  useEffect(() => {
    if (user) {
      setIsLoadingStatus(true);
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setIsPremium(userData.isPremium === true);
        } else {
          // Handle case where user doc might not exist yet
          setIsPremium(false);
        }
        setIsLoadingStatus(false);
      }, (error) => {
        console.error("Error listening to user status:", error);
        toast.error("Could not fetch your subscription status.");
        setIsLoadingStatus(false);
        setIsPremium(false);
      });

      // Cleanup listener on component unmount or user change
      return () => unsubscribe();
    } else {
      // No user logged in
      setIsPremium(false);
      setIsLoadingStatus(false);
    }
  }, [user]);

  // Change the payment plan
  const handlePlanChange = (planIdParam: string) => {
    setPlanId(planIdParam);

    // Log plan_selected event
    analytics.logEvent('plan_selected', {
      plan_id: planIdParam
    });
  };

  const createOrderAndInitPayment = async () => {
    // User must be logged in
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    try {
      setIsCreatingOrder(true);
      
      // Log payment_initiated event
      analytics.logEvent('payment_initiated', {
        plan_id: planId
      });

      // ... rest of the code ...
    } catch (error: any) {
      console.error("Error creating order:", error);
      setIsCreatingOrder(false);
      toast.error(error.message || "Failed to initiate payment");
      
      // Log payment_error event
      analytics.logEvent('payment_error', {
        plan_id: planId,
        error_message: error.message || "Unknown error"
      });
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to upgrade.");
      return;
    }
    if (!window.Razorpay) {
        toast.error("Payment gateway is not loaded yet. Please wait a moment and try again.");
        return;
    }

    setIsLoading(true);
    analytics.then(analyticInstance => {
      if (analyticInstance) {
        logEvent(analyticInstance, 'begin_checkout', { currency: 'INR', value: 499 }); // Example value
      }
    });

    try {
      // 1. Create Order on Backend
      const amountInPaise = 49900; // Example: 499 INR
      const currency = "INR";
      const orderResult: HttpsCallableResult<CreateOrderResponse> = await createRazorpayOrderCallable({ amount: amountInPaise, currency });
      const orderId = orderResult.data.orderId;

      if (!orderId) {
        throw new Error("Could not create payment order.");
      }

      // 2. Configure Razorpay Checkout
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Get Key ID from frontend env vars
        amount: amountInPaise,
        currency: currency,
        name: "DateSpark",
        description: "Premium Subscription",
        order_id: orderId,
        handler: function (response) {
          // This function is called after payment is successful (or fails on Razorpay's side)
          // Verification happens on the backend via webhook, so we don't strictly *need* to do much here
          // But we can show a success message optimistically
          console.log("Razorpay Response:", response);
          toast.success("Payment successful! Your account will be updated shortly.");
          analytics.then(analyticInstance => {
            if (analyticInstance) {
              logEvent(analyticInstance, 'purchase', {
                transaction_id: response.razorpay_payment_id,
                value: amountInPaise / 100,
                currency: currency,
                // Add other relevant parameters
              });
            }
          });
          // Optionally redirect or update UI immediately
        },
        prefill: {
          email: user.email || undefined,
          // Add name/contact if available
        },
        notes: {
          userId: user.uid, // Pass userId in notes for backend webhook verification
        },
        theme: {
          color: "#F56565", // Example theme color (Tailwind's red-500)
        },
      };

      // 3. Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
          console.error("Razorpay Payment Failed:", response);
          toast.error(`Payment Failed: ${response.error.description || 'Please try again.'}`);
          analytics.then(analyticInstance => {
            if (analyticInstance) {
              logEvent(analyticInstance, 'payment_failed', { 
                  error_code: response.error.code,
                  error_description: response.error.description,
                  error_reason: response.error.reason
              });
            }
          });
      });
      
      rzp.open();

    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      toast.error(error.message || "Could not start payment process. Please try again.");
       analytics.then(analyticInstance => {
         if (analyticInstance) {
           logEvent(analyticInstance, 'payment_initiation_failed', { error_message: error.message || 'Unknown error' });
         }
       });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Subscription</h1>
            <p className="text-lg text-muted-foreground">
              Manage your DateSpark Premium subscription.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Your Plan
              </CardTitle>
              <CardDescription>
                Access all premium AI features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingStatus ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : isPremium ? (
                <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800">You are a Premium Member!</h3>
                  <p className="text-green-700 mt-2">Enjoy unlimited access to all DateSpark features.</p>
                  {/* Optionally add expiry date or manage subscription link here */}
                </div>
              ) : (
                <div>
                  <p className="mb-4 text-center text-muted-foreground">
                    Upgrade to Premium for unlimited access to all AI features, faster responses, and priority support.
                  </p>
                  <div className="text-center mb-6">
                      <span className="text-4xl font-bold">₹499</span>
                      <span className="text-muted-foreground"> / month</span> 
                      {/* Adjust price and period as needed */}
                  </div>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 py-6 text-lg"
                    onClick={handlePayment}
                    disabled={isLoading || !user || isLoadingStatus}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                      "Upgrade to Premium"
                    )}
                  </Button>
                  {!user && (
                     <p className="text-center text-sm text-red-600 mt-4">Please sign in to upgrade.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BillingPage;

