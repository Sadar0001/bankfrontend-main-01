import { useForm } from 'react-hook-form';
import { login as loginApi } from '../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // Import Store

export default function LoginPage() {
    // No props needed!

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // 👇 Get the login function from Zustand
    const login = useAuthStore((state) => state.login);

    const onSubmit = async (data) => {
        try {
            setErrorMessage("");

            // 1. Call API
            const res = await loginApi(data);
            const token = res.token || res.accessToken;

            if(token){
                // 2. Prepare User Data (Standardize keys)
                // IMPORTANT: I changed 'roles' to 'role' to match RequireAuth logic
                const userData = {
                    username: res.username,
                    role: res.role, // Kept singular to match RequireAuth check
                    userId: res.specificId
                };

                // 3. Save to Zustand (Store handles localStorage automatically)
                login(userData, token);

                // FIX: Check for "BRANCHMANAGER" instead of "MANAGER"
                if (userData.role === "BRANCHMANAGER") {
                    navigate("/manager");
                } else if (userData.role === "CUSTOMER") {
                    navigate("/customer"); // or "/"
                } else {
                    // Fallback
                    navigate("/");
                }

            } else {
                setErrorMessage("Server did not send a token.");
            }

        } catch (error) {
            console.error("Login Failed:", error);
            setErrorMessage("Invalid Username or Password");
        }
    }

    // ... Return JSX (Same as before, just remove props from function header) ...
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Inputs remain the same as your code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input className="mt-1 block w-full border border-gray-300 rounded p-2"
                               {...register("username", { required: "Required" })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" className="mt-1 block w-full border border-gray-300 rounded p-2"
                               {...register("password", { required: "Required" })} />
                    </div>
                    <button type="submit" disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}