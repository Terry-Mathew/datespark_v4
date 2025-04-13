import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignInForm from "@/components/auth/SignInForm";

const SignIn = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
          <SignInForm />
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn; 