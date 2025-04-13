import { Button } from "@/components/ui/button";
import { Github, Twitter } from "lucide-react";

const SocialAuth = () => {
  const handleGithubLogin = async () => {
    // Implement GitHub OAuth
    console.log("GitHub login");
  };

  const handleTwitterLogin = async () => {
    // Implement Twitter OAuth
    console.log("Twitter login");
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={handleGithubLogin}>
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" onClick={handleTwitterLogin}>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </Button>
      </div>
    </div>
  );
};

export default SocialAuth; 