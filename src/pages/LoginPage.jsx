import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Eye, EyeOff, AlertCircle, User, Lock } from 'lucide-react';

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@whatabod.com', password: 'admin123', color: 'text-violet-400 border-violet-700 bg-violet-900/20' },
  { role: 'Trainer', email: 'trainer@whatabod.com', password: 'trainer123', color: 'text-blue-400 border-blue-700 bg-blue-900/20' },
  { role: 'Member', email: 'member@whatabod.com', password: 'member123', color: 'text-emerald-400 border-emerald-700 bg-emerald-900/20' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gym-dark flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-900 via-gym-dark to-black relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative z-10 text-center px-8">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-600/30 border border-primary-500/30 p-5 rounded-2xl backdrop-blur-sm">
              <Dumbbell className="w-16 h-16 text-primary-300" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            What<span className="text-primary-400">ABod</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-md">
            Your all-in-one gym management platform. Track members, attendance, payments, and more.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Active Members', value: '8+' },
              { label: 'Expert Trainers', value: '4' },
              { label: 'Plans Available', value: '3' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-primary-300">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 lg:max-w-md flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              What<span className="text-primary-400">ABod</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-slate-400 mt-1">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base relative"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gym-border" />
              <span className="text-xs text-slate-500 whitespace-nowrap">Demo Credentials</span>
              <div className="flex-1 h-px bg-gym-border" />
            </div>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => fillDemo(cred)}
                  className={`w-full border rounded-lg px-4 py-2.5 text-left text-sm transition-all hover:opacity-90 ${cred.color}`}
                >
                  <div className="font-semibold">{cred.role}</div>
                  <div className="text-xs opacity-70 mt-0.5">{cred.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
