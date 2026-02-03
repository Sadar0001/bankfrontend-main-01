import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { login as loginApi } from '../services/api';
import { Loader2, Lock, Wallet, AlertCircle } from "lucide-react"; // Import AlertCircle icon if needed

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

// ✅ FIX: Alias 'Alert' to 'UI_Alert' to avoid naming conflicts with icons
import { Alert as UI_Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const onSubmit = async (data) => {
        try {
            setErrorMessage("");
            const res = await loginApi(data);
            const token = res.token || res.accessToken;

            if (token) {
                const userData = {
                    username: res.username,
                    role: res.role,
                    userId: res.specificId
                };
                login(userData, token);

                const roleMap = {
                    "BRANCHMANAGER": "/manager",
                    "TELLER": "/teller",
                    "CUSTOMER": "/customer",
                    "HEADMANAGER": "/headbank",
                    "CENTRALADMIN": "/central"
                };
                navigate(roleMap[userData.role] || "/");
            } else {
                setErrorMessage("Server did not return a valid session.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setErrorMessage("Invalid credentials. Please try again.");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-[400px] shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="space-y-1 text-center pb-8">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-slate-900 dark:bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>

                <CardContent>
                    {/* ✅ Uses the Aliased Component */}
                    {errorMessage && (
                        <UI_Alert variant="destructive" className="mb-4 py-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </UI_Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Enter username"
                                {...register("username", { required: "Username is required" })}
                                className="bg-slate-50 dark:bg-slate-950"
                            />
                            {errors.username && (
                                <p className="text-xs text-destructive font-medium">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to="#" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password", { required: "Password is required" })}
                                    className="pl-9 bg-slate-50 dark:bg-slate-950"
                                />
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 p-6">
                    <p className="text-xs text-muted-foreground">
                        Don't have an account? <Link to="/signup" className="text-blue-600 font-medium hover:underline">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}