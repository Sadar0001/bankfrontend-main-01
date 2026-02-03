import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "../services/api";
import { Loader2, Landmark, User, Phone, MapPin, FileText, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

// ✅ Shadcn Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function SignupPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();
    const [userdata, setUserData] = useState(null);

    const onSubmit = async (data) => {
        try {
            const res = await signUp(data);
            console.log("Success:", res);
            setUserData(res);
        } catch (error) {
            console.error("Signup failed", error);
            alert("Registration failed! Check console for details.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-3xl shadow-xl border-slate-200 dark:border-slate-800">
                <CardHeader className="space-y-1 text-center border-b bg-slate-50/50 dark:bg-slate-900/50 pb-6">
                    <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
                        <Landmark className="h-8 w-8 text-primary" />
                        Open Bank Account
                    </CardTitle>
                    <CardDescription>
                        Join millions of users. Fill in your details to get started.
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    {userdata ? (
                        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-center">
                            <div className="flex justify-center mb-4">
                                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                    <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mb-2">
                                Account Created Successfully!
                            </h3>
                            <p className="text-sm text-emerald-700 dark:text-emerald-500 mb-4">
                                Your application has been submitted.
                            </p>
                            <div className="bg-white dark:bg-black p-4 rounded border text-left overflow-auto max-h-60 text-xs font-mono">
                                <pre>{JSON.stringify(userdata, null, 2)}</pre>
                            </div>
                            <Button asChild className="mt-6 w-full" variant="outline">
                                <Link to="/login">Go to Login</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* SECTION: PERSONAL DETAILS */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <User className="h-4 w-4" /> Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            {...register("firstName", { required: "First Name is required" })}
                                            className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                                        />
                                        {errors.firstName && <span className="text-xs text-destructive">{errors.firstName.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            {...register("lastName", { required: "Last Name is required" })}
                                            className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                                        />
                                        {errors.lastName && <span className="text-xs text-destructive">{errors.lastName.message}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            placeholder="johndoe123"
                                            {...register("username", { required: "Username is required" })}
                                            className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                                        />
                                        {errors.username && <span className="text-xs text-destructive">{errors.username.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: { value: 6, message: "Min 6 characters" }
                                            })}
                                            className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                                        />
                                        {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* SECTION: CONTACT INFO */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 border-t pt-4">
                                    <Phone className="h-4 w-4" /> Contact Information
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        placeholder="john@example.com"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                        })}
                                        className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="number"
                                            placeholder="9876543210"
                                            {...register("phone", {
                                                required: "Phone is required",
                                                minLength: { value: 10, message: "Must be 10 digits" },
                                                maxLength: { value: 10, message: "Must be 10 digits" }
                                            })}
                                            className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                                        />
                                        {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="branchId">Branch ID</Label>
                                        <Input
                                            id="branchId"
                                            type="number"
                                            placeholder="e.g. 1"
                                            {...register("branchId", { required: "Branch ID is required" })}
                                            className={errors.branchId ? "border-destructive focus-visible:ring-destructive" : ""}
                                        />
                                        {errors.branchId && <span className="text-xs text-destructive">{errors.branchId.message}</span>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Residential Address</Label>
                                    <Textarea
                                        id="address"
                                        placeholder="1234 Main St, Apartment, Studio, or Floor"
                                        className={`min-h-[80px] ${errors.address ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        {...register("address", { required: "Address is required" })}
                                    />
                                    {errors.address && <span className="text-xs text-destructive">{errors.address.message}</span>}
                                </div>
                            </div>

                            {/* SECTION: LEGAL DOCUMENTS */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 border-t pt-4">
                                    <FileText className="h-4 w-4" /> Legal Documents
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="aadharNumber">Aadhar Number</Label>
                                        <Input
                                            id="aadharNumber"
                                            placeholder="1234 5678 9012"
                                            {...register("aadharNumber", {
                                                required: "Aadhar is required",
                                                pattern: { value: /^[0-9]{12}$/, message: "Must be 12 digits" }
                                            })}
                                            className={errors.aadharNumber ? "border-destructive focus-visible:ring-destructive" : ""}
                                        />
                                        {errors.aadharNumber && <span className="text-xs text-destructive">{errors.aadharNumber.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="panNumber">PAN Number</Label>
                                        <Input
                                            id="panNumber"
                                            className={`uppercase ${errors.panNumber ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                            placeholder="ABCDE1234F"
                                            {...register("panNumber", {
                                                required: "PAN is required",
                                                pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format" }
                                            })}
                                        />
                                        {errors.panNumber && <span className="text-xs text-destructive">{errors.panNumber.message}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <div className="pt-4">
                                <Button type="submit" className="w-full h-12 text-lg shadow-lg" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Processing Application...
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center border-t p-6 bg-slate-50/50 dark:bg-slate-900/50">
                    <p className="text-xs text-muted-foreground text-center">
                        By clicking submit, you agree to our <span className="underline cursor-pointer hover:text-primary">Terms of Service</span> and <span className="underline cursor-pointer hover:text-primary">Privacy Policy</span>.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}