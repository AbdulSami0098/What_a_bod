import { useState } from 'react';
import { useData } from '../context/DataContext';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import Modal from '../components/common/Modal';
import { Star, Users, Mail, Phone, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

export default function TrainersPage() {
  const { trainers, members, updateMember } = useData();
  const [expanded, setExpanded] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [assignTrainer, setAssignTrainer] = useState(null);
  const [assignMember, setAssignMember] = useState('');

  const getTrainerMembers = (trainerId) => members.filter((m) => m.trainerId === trainerId);

  const openAssign = (trainer) => {
    setAssignTrainer(trainer);
    setAssignMember('');
    setAssignModal(true);
  };

  const handleAssign = () => {
    if (!assignMember) return;
    updateMember(assignMember, { trainerId: assignTrainer.id });
    setAssignModal(false);
  };

  const unassignedMembers = members.filter((m) => !m.trainerId);
  const assignableMembers = members.filter((m) => m.trainerId !== assignTrainer?.id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Trainers', value: trainers.length },
          { label: 'Active Trainers', value: trainers.filter((t) => t.status === 'active').length },
          { label: 'Total Clients', value: members.filter((m) => m.trainerId).length },
          { label: 'Unassigned Members', value: unassignedMembers.length },
        ].map((s) => (
          <div key={s.label} className="card text-center py-4">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {trainers.map((trainer) => {
          const trainerMembers = getTrainerMembers(trainer.id);
          const isExpanded = expanded === trainer.id;

          return (
            <div key={trainer.id} className="card hover:border-slate-600 transition-colors">
              <div className="flex items-start gap-4">
                <div className={clsx('w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0', trainer.avatarColor)}>
                  {trainer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white text-lg">{trainer.name}</h3>
                    <span className="badge-success">{trainer.status}</span>
                  </div>
                  <p className="text-primary-400 text-sm font-medium">{trainer.specialization}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" fill="currentColor" />{trainer.rating}</span>
                    <span className="flex items-center gap-1"><Award className="w-3 h-3" />{trainer.experience}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{trainerMembers.length} clients</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                  <span className="truncate">{trainer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                  <span>{trainer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 col-span-2">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                  <span>{trainer.schedule}</span>
                </div>
              </div>

              {trainer.bio && (
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">{trainer.bio}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-1.5">
                {trainer.certifications.map((cert) => (
                  <span key={cert} className="text-xs bg-gym-dark border border-gym-border text-slate-400 px-2 py-0.5 rounded-md">
                    {cert}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gym-border flex items-center justify-between">
                <button
                  onClick={() => setExpanded(isExpanded ? null : trainer.id)}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {trainerMembers.length > 0 ? (
                    <>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {isExpanded ? 'Hide' : 'View'} {trainerMembers.length} client{trainerMembers.length !== 1 ? 's' : ''}
                    </>
                  ) : (
                    <span className="text-slate-600">No clients yet</span>
                  )}
                </button>
                <button
                  onClick={() => openAssign(trainer)}
                  className="text-sm btn-secondary py-1.5"
                >
                  Assign Member
                </button>
              </div>

              {isExpanded && trainerMembers.length > 0 && (
                <div className="mt-4 space-y-2">
                  {trainerMembers.map((m) => {
                    const plan = MEMBERSHIP_PLANS.find((p) => p.id === m.planId);
                    return (
                      <div key={m.id} className="flex items-center gap-3 p-3 bg-gym-dark rounded-lg border border-gym-border/50">
                        <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white', m.avatarColor)}>
                          {m.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white">{m.name}</div>
                          <div className="text-xs text-slate-500">{plan?.name || 'No plan'}</div>
                        </div>
                        <span className={clsx('text-xs', m.status === 'active' ? 'badge-success' : 'badge-warning')}>
                          {m.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal open={assignModal} onClose={() => setAssignModal(false)} title={`Assign Member to ${assignTrainer?.name}`} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Select a member to assign to <strong className="text-white">{assignTrainer?.name}</strong>.
          </p>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Select Member</label>
            <select className="input-field" value={assignMember} onChange={(e) => setAssignMember(e.target.value)}>
              <option value="">Choose a member...</option>
              {assignableMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {!m.trainerId ? '(unassigned)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAssignModal(false)} className="flex-1 btn-secondary">Cancel</button>
            <button onClick={handleAssign} disabled={!assignMember} className="flex-1 btn-primary disabled:opacity-50">
              Assign
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
