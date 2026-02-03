import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Footer from "./components/Footer";
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
            {/* SOLID BACKGROUND: Emerald 50 (Light) / Emerald 950 (Dark) */}
            <div className="min-h-screen w-full flex flex-col bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-50 font-sans antialiased">

                <Navbar />

                {/* Main Content */}
                <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
                    <Routes>
                        <Route path="/" element={<UserSection/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/signup" element={<SignupPage/>}/>

                        <Route element={<RequireAuth allowedRoles={["CUSTOMER"]} />}>
                            <Route path="/customer/*" element={<CustomerDashboard />} />
                        </Route>

                        <Route element={<RequireAuth allowedRoles={["BRANCHMANAGER"]} />}>
                            <Route path="/manager/*" element={<ManagerDashboard />} />
                        </Route>

                        <Route element={<RequireAuth allowedRoles={["TELLER"]} />}>
                            <Route path="/teller/*" element={<TellerDashboard />} />
                        </Route>

                        <Route element={<RequireAuth allowedRoles={["HEADMANAGER"]} />}>
                            <Route path="/headbank/*" element={<HeadBankDashboard />} />
                        </Route>

                        <Route path="/unauthorized" element={<div className="p-10 font-bold text-red-600">Access Denied</div>}/>
                        <Route path="*" element={<div className="p-10 font-bold">404 - Page Not Found</div>}/>
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;