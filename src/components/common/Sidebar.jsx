import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, CreditCard, CalendarCheck,
  DollarSign, UserCheck, LogOut, Dumbbell, X, ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/members', label: 'Members', icon: Users },
    { to: '/trainers', label: 'Trainers', icon: UserCheck },
    { to: '/plans', label: 'Membership Plans', icon: CreditCard },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/payments', label: 'Payments', icon: DollarSign },
  ],
  trainer: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/members', label: 'My Members', icon: Users },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  ],
  member: [
    { to: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/plans', label: 'My Plan', icon: CreditCard },
    { to: '/attendance', label: 'My Attendance', icon: CalendarCheck },
    { to: '/payments', label: 'My Payments', icon: DollarSign },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadge = {
    admin: { label: 'Administrator', color: 'bg-violet-600/20 text-violet-400 border-violet-700' },
    trainer: { label: 'Trainer', color: 'bg-blue-600/20 text-blue-400 border-blue-700' },
    member: { label: 'Member', color: 'bg-emerald-600/20 text-emerald-400 border-emerald-700' },
  }[user?.role] || {};

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-gym-card border-r border-gym-border z-30 flex flex-col transition-transform duration-300',
          'lg:translate-x-0 lg:static lg:flex',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-gym-border">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg leading-tight">What</span>
              <span className="text-primary-400 font-bold text-lg leading-tight">ABod</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-gym-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <span className={clsx('text-xs border px-2 py-0.5 rounded-full', roleBadge.color)}>
                {roleBadge.label}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-700/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx('w-4.5 h-4.5 flex-shrink-0', isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300')} size={18} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary-500" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gym-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-900/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
