import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

export default function Modal({ isOpen, onClose, title, children, description }) {
    // Map existing props to Shadcn Dialog API
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-white dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-50 sm:max-w-lg shadow-none">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="text-emerald-600 dark:text-emerald-400">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {/* Content Container */}
                <div className="py-4">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}