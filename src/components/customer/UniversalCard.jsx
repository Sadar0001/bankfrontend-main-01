export default function UniversalCard({
                                          title, badge, mainText, subText, icon, footerLeft, footerRight,
                                          variant = "default", // default | gradient | outline
                                          onClick
                                      }) {
    // Dynamic Styles based on variant
    const styles = {
        default: "bg-gray-800 border-gray-700 hover:border-gray-500",
        gradient: "bg-gradient-to-br from-blue-900 to-slate-900 border-blue-700/50",
        outline: "bg-transparent border-dashed border-gray-600 hover:border-blue-400 hover:bg-gray-800/50"
    };

    return (
        <div
            onClick={onClick}
            className={`
                ${styles[variant]} border
                min-w-[280px] h-44 rounded-xl p-5 relative 
                shadow-lg hover:shadow-2xl hover:scale-[1.02] 
                transition-all duration-300 ease-out snap-center cursor-pointer 
                flex flex-col justify-between group overflow-hidden
            `}
        >
            {/* --- 1. Top Row --- */}
            <div className="flex justify-between items-start z-10">
                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">{title}</span>
                {badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge === 'ACTIVE' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-red-900/30 text-red-400 border-red-800'}`}>
                        {badge}
                    </span>
                )}
            </div>

            {/* --- 2. Middle Content --- */}
            <div className="z-10">
                {icon ? (
                    <div className="flex items-center gap-3">
                        <span className="text-3xl text-blue-400">{icon}</span>
                        <span className="text-lg font-semibold text-gray-200">{mainText}</span>
                    </div>
                ) : (
                    <>
                        <p className="text-2xl font-mono text-white tracking-wide">{mainText}</p>
                        <p className="text-xs text-gray-500 mt-1">{subText}</p>
                    </>
                )}
            </div>

            {/* --- 3. Footer --- */}
            {(footerLeft || footerRight) && (
                <div className="flex justify-between items-end text-xs text-gray-400 font-mono z-10">
                    <span>{footerLeft}</span>
                    <span>{footerRight}</span>
                </div>
            )}

            {/* Hover Glow Effect */}
            <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition pointer-events-none"></div>
        </div>
    );
}