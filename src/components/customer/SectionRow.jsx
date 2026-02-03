import { Separator } from "@/components/ui/separator";

export default function SectionRow({ title, children }) {
    return (
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">

            {/* --- HEADER --- */}
            {/* Added 'px-4 md:px-10' so the title aligns perfectly with the cards */}
            <div className="flex items-center gap-3 mb-6 px-4 md:px-10">
                <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                    {title}
                </h3>
            </div>

            {/* --- LAYOUT CONTAINER --- */}
            <div className={
                "flex flex-wrap gap-6 " +
                // 1. HORIZONTAL SPACING (PADDING)
                // px-4 (16px) on Mobile
                // md:px-10 (40px) on Laptop - Gives that premium whitespace look.
                "px-4 md:px-10 " +

                // 2. ALIGNMENT
                // Mobile: Centers the single card stack
                // Laptop: Aligns cards to the start (Left)
                "justify-center md:justify-start"
            }>
                {children}
            </div>
        </section>
    );
}