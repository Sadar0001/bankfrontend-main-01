import { cn } from "@/lib/utils";

export default function SectionRow({ title, children }) {
    return (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-3 px-2">
                <div className="h-2 w-2 bg-emerald-600 rounded-full" />
                <h3 className="text-sm font-bold tracking-widest text-emerald-800 dark:text-emerald-200 uppercase">
                    {title}
                </h3>
            </div>

            {/* SOLID SECTION BOX: White (Light) / Emerald 950 (Dark) */}
            <div className={cn(
                "w-full rounded-2xl border",
                "bg-white dark:bg-emerald-950",
                "border-emerald-200 dark:border-emerald-700",
                "p-6 md:p-8 flex flex-wrap gap-6 justify-start items-stretch shadow-sm"
            )}>
                {children}
            </div>
        </section>
    );
}