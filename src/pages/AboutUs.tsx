import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About DateSpark</h1>
          
          <div className="prose prose-lg max-w-none mx-auto text-muted-foreground">
            <p>
              Welcome to DateSpark! We believe that finding meaningful connections online should be easier and more authentic. In today's fast-paced digital world, crafting the perfect dating profile and striking up engaging conversations can feel overwhelming. That's where we come in.
            </p>
            <p>
              DateSpark was founded by a team passionate about leveraging technology to enhance human connection. We saw the potential for Artificial Intelligence to help people put their best foot forward in the dating scene, not by creating fake personas, but by helping them articulate their true selves more effectively.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p>
              Our mission is to empower individuals to build genuine connections by providing AI-powered tools that enhance their online dating profiles and communication skills. We aim to make online dating less daunting and more successful for everyone.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
            <ul>
              <li><strong>AI Bio Generation:</strong> Create unique and engaging bios that capture your personality.</li>
              <li><strong>Prompt Punch-Up:</strong> Craft standout responses to dating app prompts.</li>
              <li><strong>Conversation Starters:</strong> Get personalized opening messages to break the ice.</li>
            </ul>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
            <p>
              Authenticity, privacy, and user empowerment are at the core of everything we do. We are committed to providing helpful tools while respecting your data and encouraging genuine self-representation.
            </p>
            <p>
              Thank you for choosing DateSpark. We're excited to be part of your dating journey!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;

