import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import {
  ArrowLeft, Phone, Mail, MapPin, Target, User, Calendar, Shield,
  Dumbbell, CheckCircle, XCircle, Clock,
} from 'lucide-react';
import clsx from 'clsx';

const STATUS_CONFIG = {
  active: { label: 'Active', class: 'badge-success' },
  inactive: { label: 'Inactive', class: 'badge-warning' },
  expired: { label: 'Expired', class: 'badge-danger' },
};

export default function MemberProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members, trainers, attendance, payments } = useData();

  const member = members.find((m) => m.id === id);
  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <User className="w-12 h-12 mb-3" />
        <p>Member not found</p>
        <button onClick={() => navigate('/members')} className="mt-4 btn-secondary">
          Back to Members
        </button>
      </div>
    );
  }

  const plan = MEMBERSHIP_PLANS.find((p) => p.id === member.planId);
  const trainer = trainers.find((t) => t.id === member.trainerId);
  const memberPayments = payments.filter((p) => p.memberId === member.id);
  const memberAttendance = attendance
    .filter((a) => a.memberId === member.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const attendanceRate = (() => {
    const records = attendance.filter((a) => a.memberId === member.id);
    const present = records.filter((a) => a.status !== 'absent').length;
    return records.length ? Math.round((present / records.length) * 100) : 0;
  })();

  const status = STATUS_CONFIG[member.status] || STATUS_CONFIG.active;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/members')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Members
      </button>

      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className={clsx('w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0', member.avatarColor)}>
            {member.avatar}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{member.name}</h2>
              <span className={status.class}>{status.label}</span>
            </div>
            <p className="text-slate-400 mt-0.5">{member.email}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{member.phone}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Joined {member.joinDate}</span>
              {member.age && <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{member.age} years old</span>}
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-3xl font-bold text-primary-400">{attendanceRate}%</div>
            <div className="text-xs text-slate-400 mt-0.5">Attendance Rate</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2"><User className="w-4 h-4 text-primary-400" />Personal Info</h3>
          <div className="space-y-3 text-sm">
            {member.address && (
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
                {member.address}
              </div>
            )}
            {member.emergencyContact && (
              <div className="flex items-start gap-2 text-slate-400">
                <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
                <span><strong className="text-slate-300">Emergency:</strong> {member.emergencyContact}</span>
              </div>
            )}
            {member.goal && (
              <div className="flex items-start gap-2 text-slate-400">
                <Target className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
                {member.goal}
              </div>
            )}
            {(member.weight || member.height) && (
              <div className="flex gap-4">
                {member.weight && <span className="text-slate-400">Weight: <strong className="text-slate-200">{member.weight}</strong></span>}
                {member.height && <span className="text-slate-400">Height: <strong className="text-slate-200">{member.height}</strong></span>}
              </div>
            )}
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2"><Shield className="w-4 h-4 text-amber-400" />Membership</h3>
          {plan ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan</span>
                <span className="text-white font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Price</span>
                <span className="text-white font-medium">${plan.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expiry</span>
                <span className="text-white font-medium">{member.planExpiry || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className={status.class}>{status.label}</span>
              </div>
            </div>
          ) : <p className="text-slate-500 text-sm">No plan assigned</p>}
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2"><Dumbbell className="w-4 h-4 text-violet-400" />Trainer</h3>
          {trainer ? (
            <div className="flex items-center gap-3">
              <div className={clsx('w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white', trainer.avatarColor)}>
                {trainer.avatar}
              </div>
              <div>
                <div className="font-medium text-white">{trainer.name}</div>
                <div className="text-xs text-slate-400">{trainer.specialization}</div>
                <div className="text-xs text-slate-500 mt-0.5">{trainer.email}</div>
              </div>
            </div>
          ) : <p className="text-slate-500 text-sm">No trainer assigned</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-white mb-4">Recent Attendance</h3>
          {memberAttendance.length === 0 ? (
            <p className="text-slate-500 text-sm">No attendance records</p>
          ) : (
            <div className="space-y-2">
              {memberAttendance.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between py-2 border-b border-gym-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    {rec.status === 'present' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : rec.status === 'late' ? (
                      <Clock className="w-4 h-4 text-amber-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-sm text-slate-300">{rec.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {rec.checkIn && <span>In: {rec.checkIn}</span>}
                    {rec.checkOut && <span>Out: {rec.checkOut}</span>}
                    <span className={clsx(
                      rec.status === 'present' ? 'badge-success' :
                      rec.status === 'late' ? 'badge-warning' : 'badge-danger'
                    )}>
                      {rec.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-white mb-4">Payment History</h3>
          {memberPayments.length === 0 ? (
            <p className="text-slate-500 text-sm">No payment records</p>
          ) : (
            <div className="space-y-2">
              {memberPayments.map((pay) => (
                <div key={pay.id} className="flex items-center justify-between py-2 border-b border-gym-border/50 last:border-0">
                  <div>
                    <div className="text-sm text-slate-300">{pay.plan}</div>
                    <div className="text-xs text-slate-500">{pay.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">${pay.amount}</span>
                    <span className={pay.status === 'paid' ? 'badge-success' : 'badge-warning'}>
                      {pay.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
