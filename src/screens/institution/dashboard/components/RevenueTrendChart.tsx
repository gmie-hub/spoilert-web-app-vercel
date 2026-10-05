"use client";

import React, { useState } from "react";

export interface RevenueSeries {
  key: string;
  label: string;
  color: string;
  /** Naira amounts for Jan–Dec. */
  values: number[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const WIDTH = 1000;
const HEIGHT = 300;
const PADDING = { top: 16, right: 16, bottom: 28, left: 56 };
const Y_STEPS = 5;

const plotWidth = WIDTH - PADDING.left - PADDING.right;
const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;

const xForIndex = (index: number) => PADDING.left + (index / (MONTHS.length - 1)) * plotWidth;

// Rounds the axis top up to a 1/2/5 step so tick labels stay readable.
const niceMax = (value: number) => {
  if (value <= 0) return Y_STEPS;
  const step = value / Y_STEPS;
  const magnitude = 10 ** Math.floor(Math.log10(step));
  const niceStep = ([1, 2, 5, 10].find((m) => m * magnitude >= step) ?? 10) * magnitude;
  return niceStep * Y_STEPS;
};

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});
const formatNaira = (value: number) => nairaFormatter.format(value);

const RevenueTrendChart = ({ series }: { series: RevenueSeries[] }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const yMax = niceMax(Math.max(0, ...series.flatMap((s) => s.values)));
  const yTicks = Array.from({ length: Y_STEPS + 1 }, (_, i) => (yMax / Y_STEPS) * i);
  const yForValue = (value: number) => PADDING.top + plotHeight - (value / yMax) * plotHeight;

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
          {yTicks.map((tick) => (
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

          {series.map((s) => (
            <path
              key={s.key}
              d={smoothPath(s.values)}
              fill="none"
              stroke={s.color}
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
              {series.map((s) => (
                <circle
                  key={s.key}
                  cx={xForIndex(hoverIndex)}
                  cy={yForValue(s.values[hoverIndex] ?? 0)}
                  r={4}
                  fill={s.color}
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
            {series.map((s) => (
              <p key={s.key} className="flex items-center gap-1.5 text-gray-500">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}: {formatNaira(s.values[hoverIndex] ?? 0)}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-6">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RevenueTrendChart;
