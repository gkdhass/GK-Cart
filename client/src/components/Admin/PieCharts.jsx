/**
 * @file client/src/components/Admin/PieCharts.jsx
 * @description Pie and Donut charts for admin dashboard using Recharts.
 * Shows Products by Category (Pie) and Orders by Status (Donut).
 * Theme: Cream/Peach (#FBE8CE) + Orange (#F96D00)
 */

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

/* ── Color Mappings ─────────────────────────────────────────────────── */

const CATEGORY_COLORS = {
  Electronics: '#F96D00',
  Fashion: '#E86500',
  Home: '#22C55E',
  Sports: '#EAB308',
  Books: '#A855F7',
  Beauty: '#EC4899',
  Toys: '#3B82F6',
  Accessories: '#06B6D4',
  Other: '#94A3B8',
};

const STATUS_COLORS = {
  Pending: '#EAB308',
  Processing: '#3B82F6',
  Confirmed: '#06B6D4',
  Shipped: '#A855F7',
  Delivered: '#22C55E',
  Cancelled: '#EF4444',
};

/* ── Custom Tooltip ─────────────────────────────────────────────────── */

function CustomTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  const percent = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white border border-[#E8C99A] rounded-xl px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.payload.fill || data.payload.color }}
        />
        <span className="text-black font-medium text-sm">{data.name}</span>
      </div>
      <div className="text-gray-600 text-xs space-y-0.5">
        <p>Count: <span className="text-black font-semibold">{data.value}</span></p>
        <p>Share: <span className="text-black font-semibold">{percent}%</span></p>
      </div>
    </div>
  );
}

/* ── Custom Label ───────────────────────────────────────────────────── */

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null; // Hide labels for tiny slices
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x} y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-bold"
      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

/* ── Custom Legend ──────────────────────────────────────────────────── */

function renderCustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5 cursor-pointer group">
          <div
            className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600 text-xs group-hover:text-black transition-colors">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────── */

function PieCharts({ productData = [], orderData = [] }) {
  const productTotal = productData.reduce((sum, d) => sum + d.value, 0);
  const orderTotal = orderData.reduce((sum, d) => sum + d.value, 0);

  const getColor = (name, colorMap) => colorMap[name] || '#94A3B8';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Products by Category — Pie Chart */}
      <div className="bg-white rounded-2xl border border-[#E8C99A] p-6">
        <h3 className="text-black font-semibold text-lg mb-1">Products by Category</h3>
        <p className="text-gray-600 text-sm mb-6">Distribution across {productData.length} categories</p>

        {productData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={0}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {productData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={getColor(entry.name, CATEGORY_COLORS)}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={productTotal} />} />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            No product data available
          </div>
        )}
      </div>

      {/* Orders by Status — Donut Chart */}
      <div className="bg-white rounded-2xl border border-[#E8C99A] p-6">
        <h3 className="text-black font-semibold text-lg mb-1">Orders by Status</h3>
        <p className="text-gray-600 text-sm mb-6">{orderTotal} total orders</p>

        {orderData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                animationBegin={200}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {orderData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={getColor(entry.name, STATUS_COLORS)}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={orderTotal} />} />
              <Legend content={renderCustomLegend} />
              {/* Center label for donut */}
              <text
                x="50%" y="47%"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-2xl font-bold"
                fill="#1F2937"
              >
                {orderTotal}
              </text>
              <text
                x="50%" y="55%"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xs"
                fill="#9CA3AF"
              >
                Total
              </text>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            No order data available
          </div>
        )}
      </div>
    </div>
  );
}

export default PieCharts;
