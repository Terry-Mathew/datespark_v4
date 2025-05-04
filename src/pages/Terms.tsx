import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none mx-auto text-muted-foreground space-y-6">
            <p>
              <strong>Last Updated: {new Date().toLocaleDateString()}</strong>
            </p>
            
            <p>
              Welcome to DateSpark! These Terms of Service ("Terms") govern your access to and use of the DateSpark website, services, and applications (collectively, the "Service"). Please read these Terms carefully before using the Service.
            </p>

            <h2 className="text-2xl font-semibold pt-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use the Service.
            </p>

            <h2 className="text-2xl font-semibold pt-4">2. Use of the Service</h2>
            <p>
              DateSpark provides AI-powered tools to help enhance your online dating profile and communication. You agree to use the Service only for lawful purposes and in accordance with these Terms.
            </p>

            <h2 className="text-2xl font-semibold pt-4">3. AI-Generated Content</h2>
            <p>
              The Service uses artificial intelligence to generate suggestions (e.g., bios, prompt responses). This content is provided for inspiration and assistance only. You are solely responsible for the final content you use on your dating profiles or in your communications.
            </p>

            <h2 className="text-2xl font-semibold pt-4">4. User Accounts</h2>
            <p>
              To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-semibold pt-4">5. Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. DateSpark makes no warranties, express or implied, regarding the Service, including but not limited to its reliability, accuracy, or availability.
            </p>

            <h2 className="text-2xl font-semibold pt-4">6. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:support@datespark.app" className="text-primary hover:underline">support@datespark.app</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;

