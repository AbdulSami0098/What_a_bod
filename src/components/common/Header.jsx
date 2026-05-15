import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onMenuClick, title }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-gym-dark/80 backdrop-blur-md border-b border-gym-border px-4 sm:px-6 py-4 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        {title && (
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        )}
      </div>

      <div className="hidden sm:flex items-center bg-gym-card border border-gym-border rounded-lg px-3 py-2 gap-2 w-56">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
        />
      </div>

      <button className="relative text-slate-400 hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
          3
        </span>
      </button>

      <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-xs font-bold text-white">
        {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
      </div>
    </header>
  );
}
