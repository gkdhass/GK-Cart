/**
 * @file client/src/components/Admin/StatsCard.jsx
 * @description Statistics card with animated count for admin dashboard.
 * Theme: Cream/Peach (#FBE8CE) + Orange (#F96D00) — light card style.
 */

import { useEffect, useState, useRef } from 'react';

const colorMap = {
  blue: { bg: 'bg-white', icon: 'bg-[#FBE8CE] text-[#F96D00]', text: 'text-[#F96D00]', border: 'border-l-[#F96D00]' },
  green: { bg: 'bg-white', icon: 'bg-emerald-50 text-emerald-500', text: 'text-emerald-500', border: 'border-l-emerald-500' },
  orange: { bg: 'bg-white', icon: 'bg-[#FBE8CE] text-[#F96D00]', text: 'text-[#F96D00]', border: 'border-l-[#F96D00]' },
  purple: { bg: 'bg-white', icon: 'bg-purple-50 text-purple-500', text: 'text-purple-500', border: 'border-l-purple-500' },
  red: { bg: 'bg-white', icon: 'bg-red-50 text-red-500', text: 'text-red-500', border: 'border-l-red-500' },
};

function useCountUp(end, duration = 1500) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startTime = useRef(null);

  useEffect(() => {
    if (end === 0) { setCount(0); return; }

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    startTime.current = null;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration]);

  return count;
}

function StatsCard({ title, value, icon: Icon, color = 'blue', prefix = '', suffix = '', format = false }) {
  const displayValue = useCountUp(value);
  const colors = colorMap[color] || colorMap.blue;

  const formatNumber = (num) => {
    if (!format) return num.toLocaleString('en-IN');
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString('en-IN');
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${colors.bg} border border-[#E8C99A] border-l-4 ${colors.border} p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] group`}>
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#FBE8CE]/30 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
          <p className="text-gray-900 text-3xl font-bold tracking-tight">
            {prefix}{formatNumber(displayValue)}{suffix}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${colors.icon}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
