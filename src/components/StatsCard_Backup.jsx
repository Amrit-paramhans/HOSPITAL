function StatsCard({ icon: Icon, label, value, progress, trend }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-ecare-teal text-white shadow-md shadow-teal-100">
                    <Icon size={24} />
                </div>
                <div className="text-right">
                    <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-ecare-teal-dark">{value}</h3>
                </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div
                    className="bg-ecare-teal h-1.5 rounded-full"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <p className="text-xs text-gray-400 flex items-center">
                <span className="text-ecare-teal font-medium mr-1">↑ {trend}</span> Since last month
            </p>
        </div>
    );
}

export default StatsCard;
