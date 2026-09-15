"use client";

import React, { useState } from "react";

interface Series {
  key: string;
  label: string;
  color: string;
  values: number[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SERIES: Series[] = [
  {
    key: "gross",
    label: "Gross Revenue",
    color: "#DA8543",
    values: [120, 150, 145, 210, 195, 260, 250, 300, 290, 380, 360, 420],
  },
  {
    key: "lecturer",
    label: "Lecturer Earnings",
    color: "#0891B2",
    values: [60, 65, 70, 90, 95, 110, 115, 125, 120, 135, 140, 150],
  },
  {
    key: "institution",
    label: "Institution Earnings",
    color: "#B5179E",
    values: [25, 28, 30, 42, 45, 55, 58, 62, 60, 68, 70, 78],
  },
];

const WIDTH = 1000;
const HEIGHT = 300;
const PADDING = { top: 16, right: 16, bottom: 28, left: 56 };
const Y_MAX = 500;
const Y_TICKS = [0, 100, 200, 300, 400, 500];

const plotWidth = WIDTH - PADDING.left - PADDING.right;
const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;

const xForIndex = (index: number) => PADDING.left + (index / (MONTHS.length - 1)) * plotWidth;
const yForValue = (value: number) => PADDING.top + plotHeight - (value / Y_MAX) * plotHeight;

const smoothPath = (values: number[]) => {
  const points = values.map((value, index) => [xForIndex(index), yForValue(value)]);
  if (points.length < 2) return "";

  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const midX = (x0 + x1) / 2;
    d += ` C ${midX},${y0} ${midX},${y1} ${x1},${y1}`;
  }
  return d;
};

const formatNaira = (thousands: number) => `₦${thousands >= 1000 ? `${thousands / 1000}m` : `${thousands}k`}`;

const RevenueTrendChart = () => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleMove = (event: React.MouseEvent<SVGRectElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const index = Math.round(((relativeX - PADDING.left) / plotWidth) * (MONTHS.length - 1));
    setHoverIndex(Math.min(Math.max(index, 0), MONTHS.length - 1));
  };

  return (
    <div>
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full min-w-[640px]" role="img" aria-label="Revenue trend by month">
          {Y_TICKS.map((tick) => (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={yForValue(tick)}
                y2={yForValue(tick)}
                stroke="#EEF0F2"
                strokeWidth={1}
              />
              <text x={PADDING.left - 10} y={yForValue(tick) + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">
                {formatNaira(tick)}
              </text>
            </g>
          ))}

          {MONTHS.map((month, index) => (
            <text
              key={month}
              x={xForIndex(index)}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize="11"
              fill="#9CA3AF"
            >
              {month}
            </text>
          ))}

          {SERIES.map((series) => (
            <path
              key={series.key}
              d={smoothPath(series.values)}
              fill="none"
              stroke={series.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {hoverIndex !== null && (
            <>
              <line
                x1={xForIndex(hoverIndex)}
                x2={xForIndex(hoverIndex)}
                y1={PADDING.top}
                y2={HEIGHT - PADDING.bottom}
                stroke="#D1D5DB"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              {SERIES.map((series) => (
                <circle
                  key={series.key}
                  cx={xForIndex(hoverIndex)}
                  cy={yForValue(series.values[hoverIndex])}
                  r={4}
                  fill={series.color}
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              ))}
            </>
          )}

          <rect
            x={PADDING.left}
            y={PADDING.top}
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIndex(null)}
          />
        </svg>

        {hoverIndex !== null && (
          <div
            className="pointer-events-none absolute top-2 rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs shadow-md"
            style={{
              left: `${(xForIndex(hoverIndex) / WIDTH) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <p className="mb-1 font-semibold text-[#212529]">{MONTHS[hoverIndex]}</p>
            {SERIES.map((series) => (
              <p key={series.key} className="flex items-center gap-1.5 text-gray-500">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: series.color }} />
                {series.label}: {formatNaira(series.values[hoverIndex])}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-6">
        {SERIES.map((series) => (
          <span key={series.key} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: series.color }} />
            {series.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RevenueTrendChart;
