import React from "react";

function StatsCard({ icon: Icon, label, value, progress, trend }) {
    return (
        <div className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-[#009688] to-[#E0F2F1] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1 tracking-wide uppercase">{label}</p>
                    <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight group-hover:text-[#009688] transition-colors duration-300">
                        {value}
                    </h3>
                </div>

                <div className="p-3 rounded-xl bg-[#E0F2F1] text-[#009688] group-hover:bg-[#009688] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon size={28} />
                </div>
            </div>

            {/* Progress & Trend */}
            <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.includes('left') ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {trend.includes('left') ? '↓' : '↑'} {trend}
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#009688] to-[#4DB6AC] shadow-[0_0_10px_rgba(0,150,136,0.3)] transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default StatsCard;
