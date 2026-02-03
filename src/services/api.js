import axios from 'axios';

const base_url = "https://final-bank-backend.onrender.com/api";

// 1. Create and Export the Axios Instance
export const api = axios.create({
    baseURL: base_url,
    headers: {
        "Content-Type": "application/json"
    }
});

// 2. Interceptors
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// 3. Auth Services (Login/Signup remain here)
export const signUp = async (userData) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
};

export const login = async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
};

// 4. Dashboard Aggregation (Kept here for main dashboard loading)
export const getCustomerDashboardData = async () => {
    const [accounts, cards, loans] = await Promise.all([
        api.get('/customer/accounts').catch(() => ({ data: { data: [] } })),
        api.get('/customer/cards').catch(() => ({ data: { data: [] } })),
        api.get('/customer/loans').catch(() => ({ data: { data: [] } }))
    ]);

    return {
        accounts: accounts.data?.data || [],
        cards: cards.data?.data || [],
        loans: loans.data?.data || []
    };
};

export default api;