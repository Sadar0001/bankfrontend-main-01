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
            {/* LAYER 1: Main Page Background (Lightest Grey) - bg-slate-50 */}
            <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans antialiased relative selection:bg-primary/20">

                {/* Optional: Very faint texture */}
                <div className="fixed inset-0 -z-10 h-full w-full bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none opacity-40" />

                <Navbar />

                {/* Main Content Container with padding */}
                <div className="container mx-auto py-8 px-4 md:px-6">
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

                        <Route path="/unauthorized" element={<h1>Access Denied</h1>}/>
                        <Route path="*" element={<h1>404 - Page Not Found</h1>}/>
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;