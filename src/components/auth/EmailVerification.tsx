import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const EmailVerification = () => {
  const { user, verifyEmail, resendVerificationEmail } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully!");
    } catch (error) {
      toast.error("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      await resendVerificationEmail();
      setCountdown(60); // Start 60-second countdown
      toast.success("Verification email sent!");
    } catch (error) {
      toast.error("Failed to send verification email");
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.emailVerified) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please check your email for a verification code and enter it below.
          </p>
          
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isLoading}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isLoading || !verificationCode}>
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={isLoading || countdown > 0}
              >
                {countdown > 0
                  ? `Resend code in ${countdown}s`
                  : "Resend verification code"}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerification; 