
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, Lightbulb } from "lucide-react";

interface Suggestion {
  type: 'positive' | 'improvement' | 'tip';
  text: string;
}

interface AIAnalysisResultProps {
  title: string;
  suggestions: Suggestion[];
  isLoading?: boolean;
}

const AIAnalysisResult = ({ title, suggestions, isLoading = false }: AIAnalysisResultProps) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-7 w-3/4 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-5 w-1/2 rounded mt-2"></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex gap-3">
              <div className="animate-pulse bg-muted h-6 w-6 rounded-full flex-shrink-0"></div>
              <div className="animate-pulse bg-muted h-6 w-full rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm animate-fadeIn">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          AI generated analysis based on your uploaded image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex gap-3 animate-slideUp" style={{ animationDelay: `${index * 150}ms` }}>
            {suggestion.type === 'positive' && (
              <div className="mt-0.5">
                <Badge className="bg-green-500 text-white">
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Positive
                </Badge>
              </div>
            )}
            
            {suggestion.type === 'improvement' && (
              <div className="mt-0.5">
                <Badge variant="outline" className="text-amber-500 border-amber-500">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                  Improve
                </Badge>
              </div>
            )}
            
            {suggestion.type === 'tip' && (
              <div className="mt-0.5">
                <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                  <Lightbulb className="h-3.5 w-3.5 mr-1" />
                  Tip
                </Badge>
              </div>
            )}
            
            <p>{suggestion.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisResult;
