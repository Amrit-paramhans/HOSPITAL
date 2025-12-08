import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "1", value: 10 },
    { name: "10", value: 12 },
    { name: "20", value: 50 },
    { name: "30", value: 40 },
    { name: "20", value: 60 },
    { name: "200", value: 80 },
];

function ActivityChart() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Analytics</h3>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#A0CAF0" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#A0CAF0" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#A0CAF0"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ActivityChart;
