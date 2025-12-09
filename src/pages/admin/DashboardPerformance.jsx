import React, { useState, useEffect } from "react";
import { MdTrendingUp, MdError, MdCheckCircle } from "react-icons/md";
import { getEntries } from "../../data/entriesStore";
import { getInventory } from "../../data/inventoryStore";
import doctors from "../../data/doctors";

function DashboardPerformance() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const allEntries = getEntries();
        const invAll = getInventory();

        const doctorStats = doctors.map(doc => {
            const docEntries = allEntries.filter(e => e.doctorId === doc.id);

            let totalItems = 0;
            let discrepancies = 0;
            const monthlyData = {};

            docEntries.forEach(entry => {
                const inv = invAll.find(i => i.nurseEntryId === entry.id);
                const month = entry.date.substring(0, 7); // YYYY-MM

                if (!monthlyData[month]) monthlyData[month] = { total: 0, errors: 0 };

                entry.items.forEach(item => {
                    totalItems++;
                    monthlyData[month].total++;

                    const invMatch = inv?.itemsVerified.find(i => i.name === item.name);
                    const storeQty = invMatch?.qty ?? 0;

                    if (storeQty !== item.qty) {
                        discrepancies++;
                        monthlyData[month].errors++;
                    }
                });
            });

            const accuracy =
                totalItems === 0 ? 100 : Math.round(((totalItems - discrepancies) / totalItems) * 100);

            const chartData = Object.keys(monthlyData)
                .sort()
                .map(month => ({
                    name: month,
                    accuracy:
                        monthlyData[month].total === 0
                            ? 100
                            : Math.round(
                                ((monthlyData[month].total - monthlyData[month].errors) /
                                    monthlyData[month].total) *
                                100
                            )
                }));

            return {
                ...doc,
                totalItems,
                discrepancies,
                accuracy,
                chartData
            };
        });

        setStats(doctorStats);
    }, []);

    // SVG path generation
    const getSvgPath = (data, width, height) => {
        if (!data || data.length === 0) return { areaPath: "", points: "" };

        if (data.length === 1) {
            const y = height - (data[0].accuracy / 100) * height;
            const point = `0,${y}`;
            return {
                areaPath: `M0,${height} L0,${y} L${width},${height} Z`,
                points: point
            };
        }

        const stepX = width / (data.length - 1);

        const points = data.map((d, i) => {
            const x = i * stepX;
            const y = height - (d.accuracy / 100) * height;
            return `${x},${y}`;
        });

        const areaPath = `M0,${height} L${points.join(" L")} L${width},${height} Z`;

        return { areaPath, points: points.join(" ") };
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor Performance Tracker</h1>
            <p className="text-gray-500 mb-8">Accuracy scores and discrepancy analysis</p>

            <div className="grid grid-cols-1 gap-8">
                {stats.map(doc => (
                    <div
                        key={doc.id}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{doc.name}</h2>
                                <p className="text-gray-500">{doc.specialty}</p>
                            </div>
                            <div
                                className={`px-4 py-2 rounded-lg text-xl font-bold ${doc.accuracy >= 90
                                        ? "bg-green-100 text-green-700"
                                        : doc.accuracy >= 75
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {doc.accuracy}% Accuracy
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-600 mb-1">
                                    <MdCheckCircle />{" "}
                                    <span className="font-semibold">Total Items Prescribed</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-800">
                                    {doc.totalItems}
                                </span>
                            </div>

                            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                <div className="flex items-center gap-2 text-red-600 mb-1">
                                    <MdError />{" "}
                                    <span className="font-semibold">Discrepancies Found</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-800">
                                    {doc.discrepancies}
                                </span>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="flex items-center gap-2 text-purple-600 mb-1">
                                    <MdTrendingUp />{" "}
                                    <span className="font-semibold">Performance Trend</span>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {doc.chartData.length > 0
                                        ? `Tracking last ${doc.chartData.length} months`
                                        : "No data yet"}
                                </span>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="mt-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">
                                Monthly Accuracy Trend
                            </h3>

                            <div className="h-64 w-full bg-gray-50 rounded-lg relative overflow-hidden">
                                {doc.chartData.length > 0 ? (
                                    <svg
                                        viewBox="0 0 600 250"
                                        className="w-full h-full"
                                        preserveAspectRatio="none"
                                    >
                                        {/* Grid */}
                                        <line x1="0" y1="62.5" x2="600" y2="62.5" stroke="#e5e7eb" />
                                        <line x1="0" y1="125" x2="600" y2="125" stroke="#e5e7eb" />
                                        <line x1="0" y1="187.5" x2="600" y2="187.5" stroke="#e5e7eb" />

                                        {/* Area */}
                                        <path
                                            d={getSvgPath(doc.chartData, 600, 250).areaPath}
                                            fill="#009688"
                                            fillOpacity="0.2"
                                        />

                                        {/* Line */}
                                        <polyline
                                            points={getSvgPath(doc.chartData, 600, 250).points}
                                            fill="none"
                                            stroke="#009688"
                                            strokeWidth="3"
                                        />

                                        {/* Dots */}
                                        {doc.chartData.map((d, i) => {
                                            const stepX =
                                                600 / (doc.chartData.length - 1 || 1);
                                            const x = i * stepX;
                                            const y = 250 - (d.accuracy / 100) * 250;

                                            return (
                                                <g key={i} className="group">
                                                    <circle cx={x} cy={y} r="4" fill="#009688" />
                                                    <rect
                                                        x={x - 30}
                                                        y={y - 35}
                                                        width="60"
                                                        height="25"
                                                        rx="4"
                                                        fill="black"
                                                        fillOpacity="0.8"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    />
                                                    <text
                                                        x={x}
                                                        y={y - 18}
                                                        textAnchor="middle"
                                                        fill="white"
                                                        fontSize="12"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        {d.accuracy}%
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 italic">
                                        No historical data available for chart
                                    </div>
                                )}
                            </div>

                            {/* X-axis labels */}
                            {doc.chartData.length > 0 && (
                                <div className="flex justify-between mt-2 px-2">
                                    {doc.chartData.map((d, i) => (
                                        <span key={i} className="text-xs text-gray-400">
                                            {d.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardPerformance;
