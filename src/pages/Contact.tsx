import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  // Basic form submission handler (replace with actual logic)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add logic to send form data (e.g., via email or API)
    alert("Contact form submitted (placeholder - no actual submission).");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16"> {/* Added padding */}
        <div className="container max-w-2xl"> {/* Centered content, smaller width */}
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Contact Us</h1>
          
          <p className="text-center text-muted-foreground mb-8">
            Have questions or feedback? We'd love to hear from you. Fill out the form below or email us directly at <a href="mailto:support@datespark.app" className="text-primary hover:underline">support@datespark.app</a>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Your Name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your Email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" type="text" placeholder="Subject" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your Message" required className="mt-1" rows={5} />
            </div>
            <div className="text-center">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

