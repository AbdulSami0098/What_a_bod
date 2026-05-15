import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import Modal from '../components/common/Modal';
import { DollarSign, Plus, CheckCircle, Clock, TrendingUp, CreditCard, Filter } from 'lucide-react';
import clsx from 'clsx';

export default function PaymentsPage() {
  const { members, payments, addPayment, updatePaymentStatus } = useData();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMember, setFilterMember] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ memberId: '', plan: 'Monthly', amount: 49, method: 'Credit Card', dueDate: '' });

  const isMember = user?.role === 'member';
  const currentMember = isMember ? members.find((m) => m.email === user.email) : null;

  const filteredPayments = payments.filter((p) => {
    if (isMember && currentMember) return p.memberId === currentMember.id;
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchMember = !filterMember || p.memberId === filterMember;
    return matchStatus && matchMember;
  });

  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingAmount = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const paidCount = payments.filter((p) => p.status === 'paid').length;

  const getMember = (id) => members.find((m) => m.id === id);

  const handleAdd = (e) => {
    e.preventDefault();
    addPayment({
      ...form,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
    setAddModal(false);
    setForm({ memberId: '', plan: 'Monthly', amount: 49, method: 'Credit Card', dueDate: '' });
  };

  return (
    <div className="space-y-6">
      {!isMember && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400 bg-emerald-900/20' },
            { label: 'Pending Amount', value: `$${pendingAmount}`, icon: Clock, color: 'text-amber-400 bg-amber-900/20' },
            { label: 'Paid Invoices', value: paidCount, icon: CheckCircle, color: 'text-blue-400 bg-blue-900/20' },
          ].map((s) => (
            <div key={s.label} className="card flex items-center gap-3 py-4">
              <div className={clsx('p-2.5 rounded-lg', s.color)}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <h3 className="font-semibold text-white flex-1 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary-400" />
            {isMember ? 'My Payment History' : 'All Payments'}
          </h3>
          {!isMember && (
            <>
              <select
                value={filterMember}
                onChange={(e) => setFilterMember(e.target.value)}
                className="input-field w-auto min-w-[160px]"
              >
                <option value="">All Members</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-field w-auto min-w-[130px]"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <button onClick={() => setAddModal(true)} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                <Plus className="w-4 h-4" />
                Record Payment
              </button>
            </>
          )}
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gym-border">
                {!isMember && <th className="table-header">Member</th>}
                <th className="table-header">Plan</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Date</th>
                <th className="table-header">Due Date</th>
                <th className="table-header">Method</th>
                <th className="table-header">Status</th>
                {!isMember && <th className="table-header">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border/50">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No payment records found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => {
                  const member = getMember(pay.memberId);
                  return (
                    <tr key={pay.id} className="hover:bg-white/3 transition-colors">
                      {!isMember && (
                        <td className="table-cell">
                          {member && (
                            <div className="flex items-center gap-2">
                              <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white', member.avatarColor)}>
                                {member.avatar}
                              </div>
                              <span className="font-medium text-white text-sm">{member.name}</span>
                            </div>
                          )}
                        </td>
                      )}
                      <td className="table-cell">{pay.plan}</td>
                      <td className="table-cell">
                        <span className="font-semibold text-white">${pay.amount}</span>
                      </td>
                      <td className="table-cell">{pay.date}</td>
                      <td className="table-cell">{pay.dueDate || '—'}</td>
                      <td className="table-cell text-slate-400">{pay.method}</td>
                      <td className="table-cell">
                        <span className={pay.status === 'paid' ? 'badge-success' : 'badge-warning'}>
                          {pay.status === 'paid' ? (
                            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />Paid</span>
                          ) : (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Pending</span>
                          )}
                        </span>
                      </td>
                      {!isMember && (
                        <td className="table-cell">
                          {pay.status === 'pending' && (
                            <button
                              onClick={() => updatePaymentStatus(pay.id, 'paid')}
                              className="text-xs bg-emerald-900/20 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-lg hover:bg-emerald-900/40 transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          {filteredPayments.length} record{filteredPayments.length !== 1 ? 's' : ''}
        </div>
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Record New Payment" size="sm">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Member *</label>
            <select required className="input-field" value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}>
              <option value="">Select member...</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Plan</label>
              <select className="input-field" value={form.plan} onChange={(e) => {
                const plan = MEMBERSHIP_PLANS.find((p) => p.name === e.target.value);
                setForm({ ...form, plan: e.target.value, amount: plan?.price || 49 });
              }}>
                {MEMBERSHIP_PLANS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Amount ($)</label>
              <input type="number" className="input-field" value={form.amount} onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Payment Method</label>
            <select className="input-field" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
              {['Credit Card', 'Debit Card', 'PayPal', 'Cash', 'Bank Transfer'].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Due Date</label>
            <input type="date" className="input-field" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setAddModal(false)} className="flex-1 btn-secondary">Cancel</button>
            <button type="submit" className="flex-1 btn-primary">Record Payment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
