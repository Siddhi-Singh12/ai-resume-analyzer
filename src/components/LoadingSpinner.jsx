const LoadingSpinner = ({ text = "Analyzing resume with AI models..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    AI
                </div>
            </div>
            <p className="text-slate-300 text-sm font-medium animate-pulse">{text}</p>
        </div>
    )
}

export default LoadingSpinner
