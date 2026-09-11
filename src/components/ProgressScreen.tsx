import React, { useState } from "react";
import { UserProfile, WeightRecord } from "../types";
import { TrendingDown, TrendingUp, Plus, Calendar, Award, CheckCircle, Flame, ArrowDownRight } from "lucide-react";

interface ProgressScreenProps {
  userProfile: UserProfile;
  weightRecords: WeightRecord[];
  onAddWeightRecord: (weight: number, weekLabel: string) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  userProfile,
  weightRecords,
  onAddWeightRecord,
}) => {
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "all">("month");
  const [showLogModal, setShowLogModal] = useState(false);
  const [inputWeight, setInputWeight] = useState(userProfile.weight.toString());
  const [hoveredPoint, setHoveredPoint] = useState<WeightRecord | null>(null);

  const startWeight = weightRecords[0]?.weight || 85;
  const currentWeight =
    weightRecords[weightRecords.length - 1]?.weight || userProfile.weight;
  const totalLoss = (startWeight - currentWeight).toFixed(1);

  // SVG Chart points calculation
  const minW = Math.min(...weightRecords.map((r) => r.weight)) - 2;
  const maxW = Math.max(...weightRecords.map((r) => r.weight)) + 2;
  const chartHeight = 160;
  const chartWidth = 500;

  const points = weightRecords.map((r, i) => {
    const x = (i / (weightRecords.length - 1 || 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((r.weight - minW) / (maxW - minW || 1)) * (chartHeight - 40) - 20;
    return { ...r, x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputWeight);
    if (!isNaN(val) && val > 30 && val < 250) {
      onAddWeightRecord(val, `Week ${weightRecords.length + 1}`);
      setShowLogModal(false);
    }
  };

  return (
    <div className="pt-20 pb-28 md:pb-12 px-4 md:px-10 max-w-6xl mx-auto min-h-screen text-[#131b2e] animate-fadeIn">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#131b2e]">
            Progress Tracker
          </h1>
          <p className="text-sm text-[#434656] mt-0.5">
            Tracking healthy habits, consistency, and body composition changes.
          </p>
        </div>

        {/* Time Filters & Log CTA */}
        <div className="flex items-center gap-2">
          <div className="bg-[#eaedff] p-1 rounded-2xl border border-[#c3c5d9]/60 flex items-center">
            {(["week", "month", "all"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                  timeFilter === filter
                    ? "bg-[#003ec7] text-white shadow-sm"
                    : "text-[#434656] hover:text-[#003ec7]"
                }`}
              >
                {filter === "week"
                  ? "This Week"
                  : filter === "month"
                  ? "This Month"
                  : "All Time"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="bg-[#c1f100] text-[#546b00] font-headline font-bold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 hover:bg-[#c3f400] transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Log Weight
          </button>
        </div>
      </div>

      {/* Weight Trend Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#c3c5d9]/60 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737688] block">
              Body Composition Trend
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-headline font-extrabold text-3xl text-[#131b2e]">
                {currentWeight} kg
              </span>
              <span className="inline-flex items-center gap-1 bg-[#eaedff] text-[#003ec7] px-2.5 py-1 rounded-full text-xs font-bold">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {totalLoss} kg total loss
              </span>
            </div>
          </div>

          <div className="text-xs text-[#737688] font-medium">
            Starting: <strong className="text-[#131b2e]">{startWeight} kg</strong> • Goal:{" "}
            <strong className="text-[#003ec7]">74.0 kg</strong>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="relative w-full overflow-hidden bg-[#faf8ff] p-4 rounded-2xl border border-[#c3c5d9]/40">
          <svg
            className="w-full h-44 overflow-visible"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <line
              x1="0"
              y1="30"
              x2={chartWidth}
              y2="30"
              stroke="#e2e7ff"
              strokeDasharray="4 4"
            />
            <line
              x1="0"
              y1="80"
              x2={chartWidth}
              y2="80"
              stroke="#e2e7ff"
              strokeDasharray="4 4"
            />
            <line
              x1="0"
              y1="130"
              x2={chartWidth}
              y2="130"
              stroke="#e2e7ff"
              strokeDasharray="4 4"
            />

            {/* Gradient Area under curve */}
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#003ec7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#003ec7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path
              d={`${pathD} L ${points[points.length - 1]?.x} ${chartHeight} L ${
                points[0]?.x
              } ${chartHeight} Z`}
              fill="url(#weightGrad)"
            />

            {/* Trend Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#003ec7"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="6"
                  className="fill-white stroke-[#003ec7] stroke-[3] cursor-pointer hover:r-8 transition-all"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between mt-3 text-[11px] font-bold text-[#737688]">
            {weightRecords.map((r, i) => (
              <div key={i} className="text-center">
                <span>{r.week}</span>
                <span className="block text-[9px] font-normal text-[#434656]">
                  {r.date}
                </span>
              </div>
            ))}
          </div>

          {/* Tooltip on hover */}
          {hoveredPoint && (
            <div className="absolute top-2 right-4 bg-[#131b2e] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg animate-fadeIn">
              {hoveredPoint.week}: {hoveredPoint.weight} kg ({hoveredPoint.date})
            </div>
          )}
        </div>
      </div>

      {/* 3 Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Goal Progress Ring */}
        <div className="bg-white p-5 rounded-3xl border border-[#c3c5d9]/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737688] block">
              Overall Goal
            </span>
            <h4 className="font-headline font-extrabold text-2xl text-[#131b2e] mt-1">
              75%
            </h4>
            <span className="inline-block text-xs font-bold text-[#506600] bg-[#c1f100]/30 px-2.5 py-0.5 rounded-full mt-2">
              ✓ On Track
            </span>
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#eaedff]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#003ec7]"
                strokeDasharray="75, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-headline font-bold text-sm text-[#131b2e]">
              75%
            </span>
          </div>
        </div>

        {/* Workout Completion */}
        <div className="bg-white p-5 rounded-3xl border border-[#c3c5d9]/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737688]">
                Workouts Completed
              </span>
              <span className="text-xs font-bold text-[#003ec7]">4/5</span>
            </div>
            <h4 className="font-headline font-extrabold text-2xl text-[#131b2e]">
              80% Done
            </h4>
          </div>

          <div className="mt-4">
            <div className="w-full h-2 bg-[#eaedff] rounded-full overflow-hidden">
              <div className="h-full bg-[#003ec7] w-[80%] rounded-full" />
            </div>
            <p className="text-[11px] text-[#737688] mt-2">
              1 session remaining to hit your weekly goal
            </p>
          </div>
        </div>

        {/* Consistency Score */}
        <div className="bg-white p-5 rounded-3xl border border-[#c3c5d9]/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737688]">
                Consistency Score
              </span>
              <span className="text-xs font-bold text-[#506600]">92%</span>
            </div>
            <h4 className="font-headline font-extrabold text-2xl text-[#131b2e]">
              92%
            </h4>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-7 gap-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="text-center">
                  <div
                    className={`h-4 rounded-md mb-1 ${
                      i === 2 || i === 6
                        ? "bg-[#c3c5d9]/40"
                        : "bg-[#c1f100] border border-[#546b00]/30"
                    }`}
                  />
                  <span className="text-[9px] font-bold text-[#737688]">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Volume */}
      <div className="bg-white rounded-3xl p-6 border border-[#c3c5d9]/60 shadow-sm">
        <h3 className="font-headline font-bold text-lg text-[#131b2e] mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#003ec7]" />
          Weekly Training Duration (Minutes)
        </h3>

        <div className="grid grid-cols-7 gap-3 pt-6 items-end h-44">
          {[
            { day: "Mon", mins: 45, height: "75%" },
            { day: "Tue", mins: 35, height: "60%" },
            { day: "Wed", mins: 0, height: "5%" },
            { day: "Thu", mins: 45, height: "75%" },
            { day: "Fri", mins: 40, height: "70%" },
            { day: "Sat", mins: 25, height: "40%" },
            { day: "Sun", mins: 0, height: "5%" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] font-bold text-[#003ec7]">
                {item.mins > 0 ? `${item.mins}m` : "-"}
              </span>
              <div
                className={`w-full rounded-t-xl transition-all ${
                  item.mins > 0 ? "bg-[#003ec7] hover:bg-[#0052ff]" : "bg-[#eaedff]"
                }`}
                style={{ height: item.height }}
              />
              <span className="text-xs font-bold text-[#434656]">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log Weight Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#c3c5d9] shadow-2xl">
            <h3 className="font-headline font-bold text-xl text-[#131b2e] mb-1">
              Log Today's Weight
            </h3>
            <p className="text-xs text-[#434656] mb-4">
              Weigh yourself in the morning before breakfast for the most accurate trend.
            </p>

            <form onSubmit={handleSaveWeight}>
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase text-[#434656] mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#c3c5d9] text-xl font-headline font-bold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#003ec7]"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="w-1/2 py-3 rounded-full text-xs font-bold text-[#434656] bg-[#f2f3ff] hover:bg-[#eaedff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-full text-xs font-bold text-white bg-[#003ec7] hover:bg-[#0052ff] shadow-md"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
