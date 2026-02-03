import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { LogOut, User, LayoutDashboard, Menu, Wallet, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const { setTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate("/login"); };
    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "U";
    const getDashboardPath = () => {
        if (!user) return "/";
        switch (user.role) {
            case "BRANCHMANAGER": return "/manager";
            case "TELLER": return "/teller";
            case "HEADMANAGER": return "/headbank";
            default: return "/customer";
        }
    };

    return (
        // LAYER 0: Navbar (Little Darker than Body) - bg-slate-200
        <header className="sticky top-0 z-50 w-full border-b border-slate-300 dark:border-slate-800 bg-slate-200/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">

                {/* Logo Area */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2 transition-all hover:opacity-90">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white dark:bg-primary shadow-md">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 hidden md:inline-block">
                            BankApp
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    <Button variant="ghost" asChild className="text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-300/50">
                        <Link to="/">Home</Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-300/50 gap-1">
                                Theme <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>Light Mode</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark Mode</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-300/50">
                                    <Avatar className="h-9 w-9 border border-slate-300 dark:border-slate-700">
                                        <AvatarImage src="" alt={user.username} />
                                        <AvatarFallback className="bg-slate-800 text-white font-bold">
                                            {getInitials(user.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>
                                    <p className="text-sm font-medium">{user.username}</p>
                                    <p className="text-xs text-muted-foreground">{user.role}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>Dashboard</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" className="hover:bg-slate-300/50"><Link to="/login">Log in</Link></Button>
                            <Button asChild className="bg-slate-900 text-white hover:bg-slate-800"><Link to="/signup">Get Started</Link></Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}