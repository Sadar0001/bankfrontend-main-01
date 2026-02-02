import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import RequireAuth from "./components/RequireAuth";
import UserSection from "./components/UserSection.jsx";

// Dashboards
import CustomerDashboard from "./components/customer/CustomerDashboard";
import ManagerDashboard from "./components/manager/ManagerDashboard";
import TellerDashboard from "./components/teller/TellerDashboard";
import HeadBankDashboard from "./components/headbank/HeadBankDashboard";

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

                        {/* 1. Customer Routes */}
                        <Route element={<RequireAuth allowedRoles={["CUSTOMER"]} />}>
                            <Route path="/customer/*" element={<CustomerDashboard />} />
                        </Route>

                        {/* 2. Manager Routes */}
                        <Route element={<RequireAuth allowedRoles={["BRANCHMANAGER"]} />}>
                            <Route path="/manager/*" element={<ManagerDashboard />} />
                        </Route>

                        {/* 3. Teller Routes */}
                        <Route element={<RequireAuth allowedRoles={["TELLER"]} />}>
                            <Route path="/teller/*" element={<TellerDashboard />} />
                        </Route>

                        {/* 4. Head Bank Admin Routes */}
                        <Route element={<RequireAuth allowedRoles={["HEADMANAGER"]} />}>
                            <Route path="/headbank/*" element={<HeadBankDashboard />} />
                        </Route>

                        {/* Errors */}
                        <Route path="/unauthorized" element={<h1>Access Denied</h1>}/>
                        <Route path="*" element={<h1>404 - Page Not Found</h1>}/>

                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;