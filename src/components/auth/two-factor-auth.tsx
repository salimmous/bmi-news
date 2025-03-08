import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Mail, Smartphone, RefreshCw, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface TwoFactorAuthProps {
  email: string;
  onVerify: () => void;
  onCancel: () => void;
}

export function TwoFactorAuth({
  email,
  onVerify,
  onCancel,
}: TwoFactorAuthProps) {
  const [method, setMethod] = useState<"email" | "app">("email");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // For demo purposes, the verification code is always "123456"
  const handleVerify = async () => {
    setError("");
    setIsVerifying(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === "123456") {
        onVerify();
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during verification. Please try again.");
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setResendSuccess(false);
    setIsResending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setResendSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Please verify your identity to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={method}
          onValueChange={(value) => setMethod(value as "email" | "app")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="app" className="flex items-center">
              <Smartphone className="mr-2 h-4 w-4" />
              Authenticator App
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              We've sent a verification code to{" "}
              <span className="font-medium">{email}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-code">Verification Code</Label>
              <Input
                id="email-code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resendSuccess && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <AlertDescription>
                  A new code has been sent to your email.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-center">
              <button
                onClick={handleResendCode}
                className="text-primary hover:underline"
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="inline h-3 w-3 mr-1 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Didn't receive a code? Resend"
                )}
              </button>
            </div>
          </TabsContent>

          <TabsContent value="app" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Open your authenticator app and enter the code for BMI Tracker
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-code">Authenticator Code</Label>
              <Input
                id="app-code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="text-sm">
              <p className="text-muted-foreground">
                Don't have an authenticator app set up yet? Use the demo code:{" "}
                <span className="font-mono font-medium">123456</span>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleVerify}
          disabled={code.length !== 6 || isVerifying}
        >
          {isVerifying ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
