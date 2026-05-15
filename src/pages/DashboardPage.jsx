import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatCard from '../components/common/StatCard';
import {
  Users, DollarSign, CreditCard, TrendingUp, UserCheck, CalendarCheck,
  UserPlus, CheckCircle, AlertCircle, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  MEMBER_GROWTH, REVENUE_DATA, ATTENDANCE_TREND, PLAN_DISTRIBUTION,
  RECENT_ACTIVITY, MEMBERSHIP_PLANS,
} from '../data/mockData';
import clsx from 'clsx';

const activityIcons = {
  'user-plus': UserPlus,
  'credit-card': CreditCard,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
  'clock': Clock,
};

const activityColors = {
  member_join: 'text-emerald-400 bg-emerald-900/20',
  payment: 'text-blue-400 bg-blue-900/20',
  attendance: 'text-violet-400 bg-violet-900/20',
  plan_expire: 'text-red-400 bg-red-900/20',
  payment_pending: 'text-amber-400 bg-amber-900/20',
};

const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gym-card border border-gym-border rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="text-sm font-semibold" style={{ color: p.color }}>
            {prefix}{p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { members, payments, attendance } = useData();

  const activeMembers = members.filter((m) => m.status === 'active').length;
  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingPayments = payments.filter((p) => p.status === 'pending').length;
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === todayDate && a.status !== 'absent').length;

  const isMember = user?.role === 'member';
  const isTrainer = user?.role === 'trainer';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome back, <span className="text-primary-400">{user?.name?.split(' ')[0]}</span> 👋
        </h2>
        <p className="text-slate-400 mt-1 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {!isMember && (
          <StatCard
            title="Total Members"
            value={members.length}
            subtitle="registered users"
            icon={Users}
            iconColor="bg-blue-600/20 text-blue-400"
            trend="up"
            trendValue="+2 this month"
          />
        )}
        {!isMember && (
          <StatCard
            title="Active Members"
            value={activeMembers}
            subtitle={`${members.length - activeMembers} inactive`}
            icon={UserCheck}
            iconColor="bg-emerald-600/20 text-emerald-400"
            trend="up"
            trendValue="75% rate"
          />
        )}
        {!isTrainer && !isMember && (
          <StatCard
            title="Monthly Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtitle="from paid plans"
            icon={DollarSign}
            iconColor="bg-amber-600/20 text-amber-400"
            trend="up"
            trendValue="+8.7% vs last month"
          />
        )}
        {!isTrainer && !isMember && (
          <StatCard
            title="Pending Payments"
            value={pendingPayments}
            subtitle="awaiting collection"
            icon={CreditCard}
            iconColor="bg-red-600/20 text-red-400"
            trend="down"
            trendValue="needs attention"
          />
        )}
        <StatCard
          title="Today's Check-ins"
          value={todayAttendance || 6}
          subtitle="members present"
          icon={CalendarCheck}
          iconColor="bg-violet-600/20 text-violet-400"
          trend="up"
          trendValue="on track"
        />
        {isMember && (
          <StatCard
            title="Your Plan"
            value="Quarterly"
            subtitle="expires Jul 2026"
            icon={CreditCard}
            iconColor="bg-amber-600/20 text-amber-400"
          />
        )}
        {isMember && (
          <StatCard
            title="Attendance Rate"
            value="78%"
            subtitle="this month"
            icon={TrendingUp}
            iconColor="bg-emerald-600/20 text-emerald-400"
            trend="up"
            trendValue="+5% vs last month"
          />
        )}
      </div>

      {!isMember && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-white">Revenue Overview</h3>
                <p className="text-xs text-slate-400 mt-0.5">Last 7 months</p>
              </div>
              <span className="badge-success">+8.7%</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revenueGrad)" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-white">Plan Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Active memberships</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={PLAN_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {PLAN_DISTRIBUTION.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {PLAN_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">
                {isMember ? 'Member Growth' : 'Member Growth'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MEMBER_GROWTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="members" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-white">Recent Activity</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest events</p>
          </div>
          <div className="space-y-4">
            {RECENT_ACTIVITY.slice(0, 5).map((activity) => {
              const Icon = activityIcons[activity.icon] || CheckCircle;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={clsx('p-1.5 rounded-lg flex-shrink-0', activityColors[activity.type])}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-300 leading-relaxed">{activity.message}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
