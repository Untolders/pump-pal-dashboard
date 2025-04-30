import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Droplets, Github } from "lucide-react";
import { googleAuth } from "@/lib/googleAuth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const GoogleLogin = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        const { email, first_name,middle_name,last_name,  image, role} = result.data.user;
        const id = result.data.token;
		const pumpId = result.data.pumpId;
        const obj = { email, first_name,middle_name,last_name, id, image, role, pumpId };
        
		login(obj);
        navigate("/");
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log("Error while Google Login...", e);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    googleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pumpBg px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center p-2 rounded-full bg-pumpLight mb-4">
              <Droplets className="h-12 w-12 text-pumpPrimary" />
            </div>
            <h1 className="text-3xl font-bold text-pumpPrimary">PumpPal</h1>
            <p className="text-sm text-gray-500 mt-1">
              Petrol Pump Management System
            </p>
          </div>
        </div>

        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="text-2xl">Login with Google</CardTitle>
            <CardDescription>
              Use your Google account to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
		  <Button
  type="button"
  variant="outline"
  className="w-full flex items-center justify-center gap-2"
  onClick={handleGoogleLogin}
  disabled={isGoogleLoading}
>
  <svg
    className="h-5 w-5"
    viewBox="0 0 533.5 544.3"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M533.5 278.4c0-18.3-1.6-36.3-4.7-53.6H272v101h147.2c-6.3 34-25.1 62.7-53.4 82v68h86.3c50.4-46.4 81.4-114.9 81.4-197.4z"
      fill="#4285f4"
    />
    <path
      d="M272 544.3c72.6 0 133.5-24 178-65.5l-86.3-68c-23.9 16-54.6 25.3-91.7 25.3-70.5 0-130.3-47.6-151.6-111.4h-90.2v69.9c44.3 87.7 135.3 149.7 241.8 149.7z"
      fill="#34a853"
    />
    <path
      d="M120.4 324.7c-10.2-30.3-10.2-62.9 0-93.2v-69.9H30.2C-13.3 222-13.3 322.2 30.2 384.6l90.2-59.9z"
      fill="#fbbc04"
    />
    <path
      d="M272 107.7c39.5-.6 77.4 14.1 106.4 40.9l79.3-79.3C419.2 24.1 347.6-2.7 272 0 166.5 0 75.5 62 30.2 154.8l90.2 69.9C141.7 155.3 201.5 107.7 272 107.7z"
      fill="#ea4335"
    />
  </svg>
  {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
</Button>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              You’ll be redirected to your Google account
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            Need help? Contact support@pumppal.com
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default GoogleLogin;
