import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none mx-auto text-muted-foreground space-y-6">
            <p>
              <strong>Last Updated: {new Date().toLocaleDateString()}</strong>
            </p>
            
            <p>
              DateSpark ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, services, and applications (collectively, the "Service"). Please read this Privacy Policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.
            </p>

            <h2 className="text-2xl font-semibold pt-4">1. Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect via the Service includes:
            </p>
            <ul>
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information (like age or gender), that you voluntarily give to us when you register with the Service.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Service.</li>
              <li><strong>Data From AI Features:</strong> Text inputs you provide when using AI-powered features (e.g., for bio generation, prompt responses).</li>
            </ul>

            <h2 className="text-2xl font-semibold pt-4">2. Use of Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
            </p>
            <ul>
              <li>Create and manage your account.</li>
              <li>Process your transactions and deliver the services you request.</li>
              <li>Improve the operation and efficiency of the Service.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
              <li>Notify you of updates to the Service.</li>
              <li>Respond to customer service requests.</li>
            </ul>

            <h2 className="text-2xl font-semibold pt-4">3. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
            </p>

            <h2 className="text-2xl font-semibold pt-4">4. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
              <br />
              DateSpark Support
              <br />
              <a href="mailto:support@datespark.app" className="text-primary hover:underline">support@datespark.app</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;

