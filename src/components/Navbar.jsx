import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import useAuthStore from "../store/authStore";

export default function Navbar() {
    // 👇 Connect to Store
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-slate-800 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">

                <Link to="/" className="text-xl font-bold text-blue-400">
                    BankApp
                </Link>

                <div className="flex gap-4 items-center">
                    <Link to="/" className="hover:text-gray-300">Home</Link>

                    {/* Check user from Store directly */}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Logout ({user.username})
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-300">Login</Link>
                            <Link to="/signup" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}