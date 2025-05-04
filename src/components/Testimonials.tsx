import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import ScrollFadeIn from "@/components/ScrollFadeIn";
// Fix import errors: Use default imports instead of named imports
import LazyLoad from "@/components/ui/lazy-load"; 
import OptimizedImage from "@/components/ui/optimized-image";

const testimonials = [
  {
    name: "Alex M.",
    location: "Mumbai",
    // image: "https://ui-avatars.com/api/?name=Alex+M&background=random", // Removed image
    text: "DateSpark transformed my dating life! I saw **immediate results**—my **matches increased by 300%** in the first week. The AI-powered suggestions were spot-on!",
    initials: "AM"
  },
  {
    name: "Priya S.",
    location: "Bangalore",
    // image: "https://ui-avatars.com/api/?name=Priya+S&background=random", // Removed image
    text: "The **profile analysis feature** was eye-opening. Got **more quality matches** in a day than I did in months! The conversation starters are pure gold.",
    initials: "PS"
  },
  {
    name: "Rahul K.",
    location: "Delhi",
    // image: "https://ui-avatars.com/api/?name=Rahul+K&background=random", // Removed image
    text: "Thanks to DateSpark, I found my perfect match! The **bio generator** and **prompt suggestions** helped me showcase my personality perfectly.",
    initials: "RK"
  },
  {
    name: "Sarah L.",
    location: "Chennai",
    // image: "https://ui-avatars.com/api/?name=Sarah+L&background=random", // Removed image
    text: "As someone older, I felt out of touch with dating apps. DateSpark's **analysis helped me update my photos and bio** effectively.",
    initials: "SL"
  },
  {
    name: "David R.",
    location: "Hyderabad",
    // image: "https://ui-avatars.com/api/?name=David+R&background=random", // Removed image
    text: "The **conversation starters are gold**! I never know what to say first, but DateSpark gave me great ideas based on her profile.",
    initials: "DR"
  },
  {
    name: "Chloe T.",
    location: "Pune",
    // image: "https://ui-avatars.com/api/?name=Chloe+T&background=random", // Removed image
    text: "Finally getting **quality matches**! The AI feedback was honest but helpful. Highly recommend for anyone serious about online dating.",
    initials: "CT"
  }
];

// Helper function to format testimonial text with bold sections
const formatTestimonial = (text: string) => {
  return text.split("**").map((part, index) => 
    index % 2 === 1 ? <strong key={index} className="font-semibold text-foreground">{part}</strong> : part
  );
};

const Testimonials = () => {
  return (
    <section className="py-12 md:py-20 bg-[#FDF8F3]">
      <div className="container px-4 md:px-6">
        <LazyLoad> {/* Assuming LazyLoad wraps the section title */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Success Stories</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              See how DateSpark has helped others find their perfect match
            </p>
          </div>
        </LazyLoad>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            // Wrap each card with ScrollFadeIn and apply delay
            <ScrollFadeIn key={index} delay={index * 100}> 
              {/* Assuming LazyLoad wraps each card for image loading */}
              <LazyLoad> 
                <Card className="bg-card rounded-xl p-6 shadow-sm border flex flex-col h-full border-primary/10 overflow-hidden">
                  <CardContent className="p-0 flex flex-col h-full"> {/* Remove padding from CardContent if Card has padding */}
                    <div className="mb-4 md:mb-6">
                      <Quote className="h-6 w-6 md:h-8 md:w-8 text-primary/20" />
                    </div>

                    <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed flex-1">
                      {formatTestimonial(testimonial.text)}
                    </p>

                    <div className="flex items-center gap-3 md:gap-4 mt-auto"> {/* Use mt-auto to push avatar to bottom */}
                      <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-primary/10 ring-offset-2">
                        {/* Remove AvatarImage and rely solely on AvatarFallback */}
                        {/* 
                        <OptimizedImage
                          src={testimonial.image} // This will be undefined now
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        /> 
                        */}
                        <AvatarFallback>{testimonial.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm md:text-base">{testimonial.name}</div>
                        <div className="text-xs md:text-sm text-muted-foreground">{testimonial.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </LazyLoad>
            </ScrollFadeIn>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex justify-center items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Verified Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Real Success Stories</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

