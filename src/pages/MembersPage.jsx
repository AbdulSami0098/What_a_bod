import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  UserPlus, Search, Edit2, Trash2, Eye, Filter,
  Users, CheckCircle, AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';

const STATUS_CONFIG = {
  active: { label: 'Active', class: 'badge-success' },
  inactive: { label: 'Inactive', class: 'badge-warning' },
  expired: { label: 'Expired', class: 'badge-danger' },
};

const EMPTY_FORM = {
  name: '', email: '', phone: '', planId: 'plan-monthly',
  trainerId: '', age: '', address: '', goal: '', weight: '', height: '',
  status: 'active', planExpiry: '',
};

export default function MembersPage() {
  const { members, trainers, addMember, updateMember, deleteMember } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const isAdmin = user?.role === 'admin';

  const filtered = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditTarget(member);
    setForm({ ...EMPTY_FORM, ...member });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTarget) {
      updateMember(editTarget.id, form);
    } else {
      addMember(form);
    }
    setModalOpen(false);
  };

  const getPlan = (planId) => MEMBERSHIP_PLANS.find((p) => p.id === planId);
  const getTrainer = (trainerId) => trainers.find((t) => t.id === trainerId);

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === 'active').length,
    expired: members.filter((m) => m.status === 'expired' || m.status === 'inactive').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: stats.total, icon: Users, color: 'text-blue-400 bg-blue-900/20' },
          { label: 'Active', value: stats.active, icon: CheckCircle, color: 'text-emerald-400 bg-emerald-900/20' },
          { label: 'Inactive / Expired', value: stats.expired, icon: AlertCircle, color: 'text-red-400 bg-red-900/20' },
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

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-auto min-w-[130px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          {isAdmin && (
            <button onClick={openAdd} className="btn-primary flex items-center gap-2 whitespace-nowrap">
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          )}
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gym-border">
                <th className="table-header">Member</th>
                <th className="table-header">Plan</th>
                <th className="table-header">Trainer</th>
                <th className="table-header">Join Date</th>
                <th className="table-header">Expiry</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No members found
                  </td>
                </tr>
              ) : (
                filtered.map((member) => {
                  const plan = getPlan(member.planId);
                  const trainer = getTrainer(member.trainerId);
                  const status = STATUS_CONFIG[member.status] || STATUS_CONFIG.active;
                  return (
                    <tr key={member.id} className="hover:bg-white/3 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0', member.avatarColor)}>
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-white">{member.name}</div>
                            <div className="text-xs text-slate-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="text-slate-300">{plan?.name || '—'}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-slate-300">{trainer?.name || <span className="text-slate-500">Unassigned</span>}</span>
                      </td>
                      <td className="table-cell">{member.joinDate}</td>
                      <td className="table-cell">{member.planExpiry || '—'}</td>
                      <td className="table-cell">
                        <span className={status.class}>{status.label}</span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/members/${member.id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 transition-all"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => openEdit(member)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-900/20 transition-all"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(member)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          Showing {filtered.length} of {members.length} members
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Member' : 'Add New Member'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Full Name *</label>
              <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Email *</label>
              <input required type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@email.com" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Phone</label>
              <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Age</label>
              <input type="number" className="input-field" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="25" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Plan *</label>
              <select required className="input-field" value={form.planId} onChange={(e) => setForm({ ...form, planId: e.target.value })}>
                {MEMBERSHIP_PLANS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — ${p.price}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Assigned Trainer</label>
              <select className="input-field" value={form.trainerId} onChange={(e) => setForm({ ...form, trainerId: e.target.value })}>
                <option value="">Unassigned</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Plan Expiry</label>
              <input type="date" className="input-field" value={form.planExpiry} onChange={(e) => setForm({ ...form, planExpiry: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Address</label>
            <input className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main St, City, State" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Fitness Goal</label>
            <input className="input-field" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="Build muscle, lose weight..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">
              {editTarget ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteMember(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete Member"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
