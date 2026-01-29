
import useAuthStore from "../store/authStore.js";

const UserSection = () => {
    const { user, isAuthenticated } = useAuthStore();

    return (
        <div className="text-center mt-10">
            <h1 className="text-4xl font-bold text-slate-800">Welcome to Bank System</h1>

            {isAuthenticated && user ? (
                <div className="mt-8 p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto text-left border-l-4 border-blue-500">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                        User Profile <span className="text-sm text-gray-500">({user.role})</span>
                    </h2>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>User ID:</strong> {user.userId}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Status:</strong> <span className="text-green-600 font-bold">Active</span></p>
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-slate-600">Please Login to view your dashboard.</p>
            )}
        </div>
    );
};

export default UserSection;