
interface TestimonialCardProps {
  quote: string;
  author: string;
  image: string;
}

const TestimonialCard = ({ quote, author, image }: TestimonialCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border flex flex-col h-full">
      <div className="flex-1">
        <p className="text-card-foreground italic mb-4">"{quote}"</p>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img 
            src={image} 
            alt={author} 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium">{author}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
