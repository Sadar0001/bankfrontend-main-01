import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import RequireAuth from "./components/RequireAuth";
import UserSection from "./components/UserSection.jsx";
import CustomerDashboard from "./components/customer/CustomerDashboard";


function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-300">
                <Navbar />

                <div className="container mx-auto py-4">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<UserSection/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/signup" element={<SignupPage/>}/>

                        {/* PROTECTED ROUTES */}

                        {/* ✅ FIX: CustomerDashboard is NOW inside the RequireAuth wrapper */}
                        {/* Customer Routes */}
                        <Route element={<RequireAuth allowedRoles={["CUSTOMER"]} />}>
                            {/* 👇 Now the Real Dashboard is Protected */}
                            <Route path="/customer/*" element={<CustomerDashboard />} />
                        </Route>

                        {/* Manager Routes */}
                        <Route element={<RequireAuth allowedRoles={["MANAGER"]} />}>
                            <Route path="/manager/*" element={<h1>Manager Dashboard</h1>} />
                        </Route>

                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;

