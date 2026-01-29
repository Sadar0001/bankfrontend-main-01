import { create } from 'zustand';

const useAuthStore = create((set) => ({
    // 1. User is an Object -> Need JSON.parse
    user: JSON.parse(localStorage.getItem("user")) || null,

    // 2. Token is a String -> NO JSON.parse needed here!
    token: localStorage.getItem("token") || null,

    isAuthenticated: !!localStorage.getItem("token"),

    // login method
    login: (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token); // Storing plain string
        set({ user: userData, token: token, isAuthenticated: true });
    },

    // logout method
    logout: () => {
        localStorage.clear();
        set({ user: null, token: null, isAuthenticated: false });

        // 3. Typo fixed: 'window' not 'windows'
        window.location.href = "/login";
    }
}));

export default useAuthStore; // 4. Correct Export Syntax