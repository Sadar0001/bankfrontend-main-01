import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "../services/api";
import { Loader2, Landmark, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [userdata, setUserData] = useState(null);

    const onSubmit = async (data) => {
        try {
            const res = await signUp(data);
            setUserData(res);
        } catch (error) {
            console.error("Signup failed", error);
            // In a real app, use toast() here
        }
    };

    if (userdata) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-center">
                    <CardHeader>
                        <div className="mx-auto bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full w-fit mb-2">
                            <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <CardTitle className="text-emerald-800 dark:text-emerald-400">Account Created!</CardTitle>
                        <CardDescription>Your application has been submitted successfully.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-white dark:bg-black p-4 rounded-md border text-left overflow-auto max-h-40 text-xs font-mono">
                            <pre>{JSON.stringify(userdata, null, 2)}</pre>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                            <Link to="/login">Proceed to Login</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-10">
            <Card className="w-full max-w-2xl shadow-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader className="text-center border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="flex justify-center mb-2">
                        <Landmark className="h-10 w-10 text-slate-800 dark:text-emerald-500" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Open Bank Account</CardTitle>
                    <CardDescription>Join millions of users today.</CardDescription>
                </CardHeader>

                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        {/* Group 1: Identity */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Identity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input {...register("firstName", { required: true })} placeholder="Jane" />
                                    {errors.firstName && <span className="text-xs text-red-500">Required</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input {...register("lastName", { required: true })} placeholder="Doe" />
                                    {errors.lastName && <span className="text-xs text-red-500">Required</span>}
                                </div>
                            </div>
                        </div>

                        {/* Group 2: Credentials */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Credentials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Username</Label>
                                    <Input {...register("username", { required: true })} placeholder="janedoe" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input type="password" {...register("password", { required: true, minLength: 6 })} placeholder="••••••••" />
                                    {errors.password && <span className="text-xs text-red-500">Min 6 chars</span>}
                                </div>
                            </div>
                        </div>

                        {/* Group 3: Contact */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Contact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" {...register("email", { required: true })} placeholder="jane@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input type="number" {...register("phone", { required: true, minLength: 10, maxLength: 10 })} placeholder="9876543210" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Branch ID</Label>
                                <Input type="number" {...register("branchId", { required: true })} placeholder="1" className="max-w-[120px]" />
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Textarea {...register("address", { required: true })} placeholder="123 Main St..." />
                            </div>
                        </div>

                        {/* Group 4: Legal */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Legal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Aadhar Number</Label>
                                    <Input {...register("aadharNumber", { required: true, pattern: /^[0-9]{12}$/ })} placeholder="12 digits" />
                                </div>
                                <div className="space-y-2">
                                    <Label>PAN Number</Label>
                                    <Input className="uppercase" {...register("panNumber", { required: true })} placeholder="ABCDE1234F" />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg bg-slate-900 dark:bg-emerald-600" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}