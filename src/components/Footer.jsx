import { Link } from "react-router-dom";
import { Wallet, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
    return (
        // SOLID FOOTER: Emerald 950 (Deepest Green)
        <footer className="w-full border-t border-emerald-900 bg-emerald-950 text-emerald-100 mt-auto relative z-50">

            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">

                    <div className="space-y-5">
                        <Link to="/" className="flex items-center gap-2 group w-fit">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-900 border border-emerald-800 text-emerald-400 shadow-none">
                                <Wallet className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                BankApp
                            </span>
                        </Link>
                        <p className="text-sm text-emerald-400 leading-relaxed max-w-xs font-medium">
                            The secure foundation for your financial future.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Product</h4>
                        <ul className="space-y-3 text-sm text-emerald-300 font-medium">
                            <li><Link to="#" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Security</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Company</h4>
                        <ul className="space-y-3 text-sm text-emerald-300 font-medium">
                            <li><Link to="#" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Social</h4>
                        <div className="flex gap-3">
                            {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                                <Button key={i} variant="ghost" size="icon" className="h-9 w-9 text-emerald-400 hover:text-white bg-emerald-900 hover:bg-emerald-800 border border-emerald-800 rounded-lg">
                                    <Icon className="h-4 w-4" />
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <Separator className="bg-emerald-900" />

                <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-6">
                    <p className="text-xs text-emerald-600 font-semibold">
                        © {new Date().getFullYear()} BankApp Inc.
                    </p>
                    <div className="flex gap-8 text-xs text-emerald-500 font-semibold">
                        <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}