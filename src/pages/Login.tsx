
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// import { Droplets, Github } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

// const formSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// const Login = () => {
//   const { login, loginWithGoogle } = useAuth();
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     setIsLoading(true);
//     try {
//       await login(values.email, values.password);
//       toast({
//         title: "Welcome back!",
//         description: "You've successfully logged in.",
//       });
//     } catch (error) {
//       toast({
//         title: "Login failed",
//         description: "Please check your credentials and try again.",
//         variant: "destructive",
//       });
//       form.setError("email", { message: "Invalid email or password" });
//       form.setError("password", { message: "Invalid email or password" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setIsGoogleLoading(true);
//     try {
//       await loginWithGoogle();
//     } catch (error) {
//       // Error handling is done in the loginWithGoogle function
//     } finally {
//       setIsGoogleLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-pumpBg px-4">
//       <div className="w-full max-w-md">
//         <div className="flex justify-center mb-8 animate-fade-in">
//           <div className="flex flex-col items-center">
//             <div className="flex items-center justify-center p-2 rounded-full bg-pumpLight mb-4">
//               <Droplets className="h-12 w-12 text-pumpPrimary" />
//             </div>
//             <h1 className="text-3xl font-bold text-pumpPrimary">PumpPal</h1>
//             <p className="text-sm text-gray-500 mt-1">Petrol Pump Management System</p>
//           </div>
//         </div>
//         <Card className="animate-scale-in">
//           <CardHeader>
//             <CardTitle className="text-2xl">Login</CardTitle>
//             <CardDescription>
//               Enter your credentials to access your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full flex items-center justify-center gap-2"
//                 onClick={handleGoogleLogin}
//                 disabled={isGoogleLoading}
//               >
//                 <Github className="h-5 w-5" />
//                 {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
//               </Button>

//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <Separator className="w-full" />
//                 </div>
//                 <div className="relative flex justify-center">
//                   <span className="bg-card px-2 text-xs uppercase text-muted-foreground">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>

//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email</FormLabel>
//                         <FormControl>
//                           <Input 
//                             placeholder="you@example.com" 
//                             type="email" 
//                             autoComplete="email"
//                             {...field} 
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="password"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Password</FormLabel>
//                         <FormControl>
//                           <Input 
//                             placeholder="••••••••" 
//                             type="password"
//                             autoComplete="current-password" 
//                             {...field} 
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <Button 
//                     type="submit" 
//                     className="w-full bg-pumpPrimary hover:bg-pumpSecondary"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Logging in..." : "Sign in with Email"}
//                   </Button>
//                 </form>
//               </Form>
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <div className="text-center text-sm">
//               <p className="text-muted-foreground">Demo Credentials:</p>
//               <p className="text-muted-foreground">Admin: admin@pumppal.com / admin123</p>
//               <p className="text-muted-foreground">Super Admin: superadmin@pumppal.com / super123</p>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Login;
