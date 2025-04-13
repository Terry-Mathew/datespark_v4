import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignUpForm from "@/components/auth/SignUpForm";

const SignUp = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
          <SignUpForm />
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/signin" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp; 