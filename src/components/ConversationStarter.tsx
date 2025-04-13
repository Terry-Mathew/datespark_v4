
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface ConversationStarterProps {
  message: string;
  category: string;
  isLoading?: boolean;
}

const ConversationStarter = ({ message, category, isLoading = false }: ConversationStarterProps) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast.success("Copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <div className="animate-pulse bg-muted h-5 w-1/3 rounded"></div>
          <div className="animate-pulse bg-muted h-7 w-3/4 rounded mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-20 w-full rounded"></div>
        </CardContent>
        <CardFooter>
          <div className="animate-pulse bg-muted h-9 w-24 rounded"></div>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardDescription>
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1.5 text-primary" />
            {category}
          </div>
        </CardDescription>
        <CardTitle className="text-lg">Conversation Starter</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-card-foreground">{message}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-muted-foreground"
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConversationStarter;
