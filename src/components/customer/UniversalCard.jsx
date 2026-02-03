import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

// ✅ Your local pattern image
import cardPattern from "../../assets/card-pattern.png";

export default function UniversalCard({
                                          title,
                                          badge,
                                          mainText,
                                          subText,
                                          image,
                                          footerLeft,
                                          footerRight,
                                          onClick,
                                          isActive = false
                                      }) {
    const hasCustomImage = !!image;

    const getBadgeVariant = (status) => {
        if (!status) return "secondary";
        const s = status.toUpperCase();
        if (['ACTIVE', 'COMPLETED', 'APPROVED'].includes(s)) return "default";
        if (['BLOCKED', 'REJECTED'].includes(s)) return "destructive";
        return "secondary";
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                // 1. STRICT DIMENSIONS
                "w-[340px] h-[215px] shrink-0",

                // 2. STRUCTURE
                "relative flex flex-col justify-between overflow-hidden rounded-xl",

                // 3. INTERACTION
                "shadow-lg hover:shadow-2xl cursor-pointer group transition-all duration-300 hover:scale-[1.01]",

                // 4. BASE
                "bg-transparent text-white",

                // 5. ACTIVE STATE
                isActive && "ring-2 ring-offset-2 ring-emerald-500"
            )}
        >
            {/* LAYER 1: IMAGE (LOCKED FIT) */}
            <img
                src={hasCustomImage ? image : cardPattern}
                alt="Background"
                style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover', zIndex: 0
                }}
                className={cn(
                    "transition-transform duration-700 ease-in-out",
                    !hasCustomImage && "group-hover:scale-105" // Subtle zoom, less aggressive
                )}
            />

            {/* LAYER 2: GRADIENT OVERLAY (Professional Readability) */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)' }}
            />

            {/* LAYER 3: CONTENT */}
            <div className="relative z-20 flex flex-col justify-between h-full w-full p-6">

                {/* HEADER (No Icon, Clean Text) */}
                <div className="flex justify-between items-start">
                    {/* Title: Standard capitalization, medium weight (Not uppercase/spaced) */}
                    <p className="text-sm font-medium text-white/90 drop-shadow-sm">
                        {title}
                    </p>

                    {badge && (
                        <Badge variant={getBadgeVariant(badge)} className="h-6 px-2.5 text-xs font-medium backdrop-blur-md bg-white/20 border-white/20 text-white shadow-sm hover:bg-white/30">
                            {badge}
                        </Badge>
                    )}
                </div>

                {/* BODY (Simple, Human Typography) */}
                <div className="mt-1">
                    <h3 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
                        {mainText}
                    </h3>
                    <p className="text-sm text-white/80 mt-1 font-normal drop-shadow-sm line-clamp-2">
                        {subText}
                    </p>
                </div>

                {/* FOOTER (Clean Separator) */}
                {(footerLeft || footerRight || onClick) && (
                    <div className="flex justify-between items-center text-xs text-white/90 pt-4 border-t border-white/15">
                        <span className="opacity-80 font-medium">{footerLeft}</span>

                        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                            <span className="font-semibold">{footerRight || "View Details"}</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}