import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { login as loginApi } from '../services/api';
import { Loader2 } from "lucide-react";

// ✅ Importing Real Shadcn Components using the alias
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
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-md shadow-xl border-slate-200 dark:border-slate-800">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        BankApp
                    </CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {errorMessage && (
                        <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20 text-center">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="e.g. manager_cp"
                                {...register("username", { required: "Username is required" })}
                                className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.username && (
                                <p className="text-xs text-destructive font-medium">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password", { required: "Password is required" })}
                                className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
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

                <CardFooter className="flex justify-center border-t p-6">
                    <p className="text-xs text-muted-foreground text-center">
                        Secure Banking Portal • v1.0.0 <br/>
                        Restricted Access Only
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}