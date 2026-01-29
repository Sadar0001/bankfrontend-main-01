export default function SectionRow({ title, children }) {
    return (
        <div className="mb-10 pl-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-200 mb-4 border-l-4 border-blue-500 pl-3">
                {title}
            </h3>
            {/* Snap scrolling for mobile-native feel */}
            <div className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide snap-x pr-6">
                {children}
            </div>
        </div>
    );
}