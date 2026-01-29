import axios from 'axios';

const base_url="http://localhost:8080/api";

const api=axios.create({
    baseURL: base_url,
    headers:{
        "Content-Type":"application/json"
    }
});

// axious interceptoor to add token to request headers and handle errors globally
api.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem("token");
        if(token){
            config.headers.Authorization=`Bearer ${token}`;
         }
         return config;
        },
        (error)=>{
            return Promise.reject(error);
        }
);

api.interceptors.response.use(
    (response)=>{  // repsonse is success then fine 
        return response
    },
    (error)=>{ 
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            
            // 1. Clear the invalid token
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // 2. Force Redirect to Login Page
            // Note: We use window.location because we are outside a React Component
            window.location.href = "/login";
        }
        return Promise.reject(error); // response is error then handle globally

    }
);

// SIGN UP
export const signUp = async (userData) => {
    try {
        const response = await api.post("/auth/signup", userData);
        return response.data;
    } catch (error) {
        console.log("Signup Error: ", error);
        throw error;
    }
}

// LOGIN (Fixed URL)
export const login = async (loginData) => {
    try {
        // CHANGED: "auth/api" -> "/auth/login" (Standard Spring Boot path)
        const response = await api.post("/auth/login", loginData);
        return response.data;
    } catch (error) {
        console.log("Login Error: ", error);
        throw error;
    }
}

export const getCustomerDashboardData = async () => {
    // Parallel fetching for speed
    const [accounts, cards, loans] = await Promise.all([
        api.get('/customer/accounts').catch(() => ({ data: [] })),
        api.get('/customer/cards').catch(() => ({ data: [] })),
        api.get('/customer/loans').catch(() => ({ data: [] }))
    ]);

    // Return clean data
    return {
        accounts: accounts.data?.data || [],
        cards: cards.data?.data || [],
        loans: loans.data?.data || []
    };
};

export default api;


















