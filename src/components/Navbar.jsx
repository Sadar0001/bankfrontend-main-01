import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { LogOut, User, LayoutDashboard, Menu, Wallet, Bell, ChevronDown } from "lucide-react";
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
        const rolePaths = {
            "BRANCHMANAGER": "/manager",
            "TELLER": "/teller",
            "HEADMANAGER": "/headbank"
        };
        return rolePaths[user.role] || "/customer";
    };

    return (
        // SOLID NAVBAR: Emerald 100 (Light) / Emerald 900 (Dark)
        <header className="sticky top-0 z-50 w-full border-b border-emerald-300 dark:border-emerald-700 bg-emerald-100 dark:bg-emerald-900 shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-none">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-emerald-950 dark:text-white hidden md:inline-block">
                            BankApp
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" asChild className="text-emerald-900 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-800">
                        <Link to="/">Home</Link>
                    </Button>
                    {user && (
                        <Button variant="ghost" asChild className="text-emerald-900 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-800">
                            <Link to={getDashboardPath()}>Dashboard</Link>
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="ml-2 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-800">
                                Theme <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700">
                            <DropdownMenuItem onClick={() => setTheme("light")}>Light Mode</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark Mode</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Button variant="ghost" size="icon" className="text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-800">
                                <Bell className="h-5 w-5" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800 p-0">
                                        <Avatar className="h-9 w-9 border border-emerald-300 dark:border-emerald-600">
                                            <AvatarImage src="" alt={user.username} />
                                            <AvatarFallback className="bg-emerald-700 text-white font-bold">
                                                {getInitials(user.username)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-2 bg-white dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" align="end">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.username}</p>
                                            <p className="text-xs leading-none text-emerald-500 capitalize">{user.role.toLowerCase()}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-emerald-100 dark:bg-emerald-800"/>
                                    <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" /> Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-emerald-100 dark:bg-emerald-800"/>
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 dark:focus:bg-red-900">
                                        <LogOut className="mr-2 h-4 w-4" /> Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" className="hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-900 dark:text-emerald-50"><Link to="/login">Log in</Link></Button>
                            <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm border-0">
                                <Link to="/signup">Get Started</Link>
                            </Button>
                        </div>
                    )}

                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-white dark:bg-emerald-900">
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}