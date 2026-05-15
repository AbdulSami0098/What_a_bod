import clsx from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, iconColor, trend, trendValue }) {
  const isPositive = trend === 'up';

  return (
    <div className="card flex items-start gap-4 hover:border-slate-600 transition-colors">
      <div className={clsx('p-3 rounded-xl flex-shrink-0', iconColor || 'bg-primary-600/20')}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        <div className="flex items-center gap-1.5 mt-1">
          {trend && (
            <>
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              )}
              <span className={clsx('text-xs font-medium', isPositive ? 'text-emerald-400' : 'text-red-400')}>
                {trendValue}
              </span>
            </>
          )}
          {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}
