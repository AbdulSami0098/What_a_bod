import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import Modal from '../components/common/Modal';
import { CheckCircle, Star, Users, Crown } from 'lucide-react';
import clsx from 'clsx';

const PLAN_COLORS = {
  blue: {
    border: 'border-blue-600/40',
    badge: 'bg-blue-600/20 text-blue-300',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    icon: 'text-blue-400',
    header: 'from-blue-900/40 to-transparent',
    check: 'text-blue-400',
  },
  amber: {
    border: 'border-amber-500/50',
    badge: 'bg-amber-500/20 text-amber-300',
    button: 'bg-amber-500 hover:bg-amber-600 text-white',
    icon: 'text-amber-400',
    header: 'from-amber-900/40 to-transparent',
    check: 'text-amber-400',
  },
  emerald: {
    border: 'border-emerald-600/40',
    badge: 'bg-emerald-600/20 text-emerald-300',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    icon: 'text-emerald-400',
    header: 'from-emerald-900/40 to-transparent',
    check: 'text-emerald-400',
  },
};

export default function PlansPage() {
  const { members, updateMember } = useData();
  const { user } = useAuth();
  const [assignModal, setAssignModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMember, setSelectedMember] = useState('');

  const isAdmin = user?.role === 'admin';
  const memberCounts = MEMBERSHIP_PLANS.reduce((acc, plan) => {
    acc[plan.id] = members.filter((m) => m.planId === plan.id).length;
    return acc;
  }, {});

  const openAssign = (plan) => {
    setSelectedPlan(plan);
    setSelectedMember('');
    setAssignModal(true);
  };

  const handleAssign = () => {
    if (!selectedMember) return;
    const today = new Date();
    const expiry = new Date(today);
    expiry.setMonth(today.getMonth() + selectedPlan.duration);
    updateMember(selectedMember, {
      planId: selectedPlan.id,
      planExpiry: expiry.toISOString().split('T')[0],
      status: 'active',
    });
    setAssignModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">Choose the best plan for your members</p>
        </div>
        <div className="flex items-center gap-2 bg-gym-card border border-gym-border rounded-lg px-3 py-1.5">
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-slate-300">{members.filter((m) => m.status === 'active').length} active memberships</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEMBERSHIP_PLANS.map((plan) => {
          const colors = PLAN_COLORS[plan.color];
          return (
            <div
              key={plan.id}
              className={clsx(
                'relative bg-gym-card border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
                colors.border,
                plan.popular && 'ring-2 ring-amber-500/30'
              )}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-amber-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3" fill="currentColor" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className={clsx('bg-gradient-to-b p-6 pb-4', colors.header)}>
                <div className={clsx('inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3', colors.badge)}>
                  {plan.duration} {plan.durationUnit}
                </div>
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">${plan.price}</span>
                  <span className="text-slate-400 mb-1">/ {plan.durationUnit}</span>
                </div>
                {plan.pricePerMonth && (
                  <p className="text-xs text-slate-400 mt-1">${plan.pricePerMonth}/month · Save {Math.round((1 - plan.pricePerMonth / 49) * 100)}%</p>
                )}
              </div>

              <div className="p-6 pt-4">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className={clsx('w-4 h-4 flex-shrink-0 mt-0.5', colors.check)} />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <Users className="w-3.5 h-3.5" />
                  <span>{memberCounts[plan.id] || 0} members on this plan</span>
                </div>

                {isAdmin ? (
                  <button
                    onClick={() => openAssign(plan)}
                    className={clsx('w-full py-2.5 rounded-xl font-semibold text-sm transition-colors', colors.button)}
                  >
                    Assign to Member
                  </button>
                ) : (
                  <div className={clsx('w-full py-2.5 rounded-xl font-semibold text-sm text-center', colors.badge)}>
                    {user?.role === 'member' ? 'Contact Admin to Upgrade' : 'View Plan'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 className="font-semibold text-white mb-4">Plan Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gym-border">
                <th className="table-header">Feature</th>
                {MEMBERSHIP_PLANS.map((p) => (
                  <th key={p.id} className="table-header text-center">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border/50">
              {[
                'Full Gym Access',
                'Locker Room',
                'Basic Classes',
                'All Classes',
                'Guest Passes',
                'Nutrition Consultation',
                'Personal Training',
              ].map((feature) => (
                <tr key={feature} className="hover:bg-white/3">
                  <td className="table-cell font-medium text-slate-300">{feature}</td>
                  {MEMBERSHIP_PLANS.map((plan) => {
                    const has = plan.features.some((f) => f.includes(feature.split(' ')[0]));
                    return (
                      <td key={plan.id} className="table-cell text-center">
                        {has ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 inline" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={assignModal} onClose={() => setAssignModal(false)} title={`Assign ${selectedPlan?.name} Plan`} size="sm">
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">
            Select a member to assign the <strong className="text-white">{selectedPlan?.name}</strong> plan (${selectedPlan?.price}).
          </p>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Select Member</label>
            <select
              className="input-field"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">Choose a member...</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAssignModal(false)} className="flex-1 btn-secondary">Cancel</button>
            <button onClick={handleAssign} disabled={!selectedMember} className="flex-1 btn-primary disabled:opacity-50">
              Assign Plan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
