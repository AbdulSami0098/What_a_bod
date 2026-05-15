import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Clock, Calendar, TrendingUp, Users } from 'lucide-react';
import clsx from 'clsx';

const STATUS_OPTS = [
  { value: 'present', label: 'Present', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-700 hover:bg-emerald-900/40' },
  { value: 'late', label: 'Late', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-900/20 border-amber-700 hover:bg-amber-900/40' },
  { value: 'absent', label: 'Absent', icon: XCircle, color: 'text-red-400', bg: 'bg-red-900/20 border-red-700 hover:bg-red-900/40' },
];

export default function AttendancePage() {
  const { members, attendance, markAttendance } = useData();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('mark');
  const [historyMember, setHistoryMember] = useState('');

  const isMember = user?.role === 'member';

  const visibleMembers = isMember
    ? members.filter((m) => m.email === user.email)
    : members;

  const getAttendanceForDate = (memberId, date) =>
    attendance.find((a) => a.memberId === memberId && a.date === date);

  const todayStats = (() => {
    const today = selectedDate;
    const present = attendance.filter((a) => a.date === today && a.status === 'present').length;
    const late = attendance.filter((a) => a.date === today && a.status === 'late').length;
    const absent = attendance.filter((a) => a.date === today && a.status === 'absent').length;
    return { present, late, absent };
  })();

  const historyRecords = historyMember
    ? attendance
        .filter((a) => a.memberId === historyMember)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 30)
    : [];

  const memberAttendanceRate = (memberId) => {
    const records = attendance.filter((a) => a.memberId === memberId);
    const present = records.filter((a) => a.status !== 'absent').length;
    return records.length ? Math.round((present / records.length) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Present', value: todayStats.present, icon: CheckCircle, color: 'text-emerald-400 bg-emerald-900/20' },
          { label: 'Late', value: todayStats.late, icon: Clock, color: 'text-amber-400 bg-amber-900/20' },
          { label: 'Absent', value: todayStats.absent, icon: XCircle, color: 'text-red-400 bg-red-900/20' },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-3 py-4">
            <div className={clsx('p-2.5 rounded-lg', s.color)}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label} today</div>
            </div>
          </div>
        ))}
      </div>

      {!isMember && (
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('mark')}
            className={clsx('px-4 py-2 rounded-lg text-sm font-medium transition-colors', viewMode === 'mark' ? 'bg-primary-600 text-white' : 'bg-gym-card border border-gym-border text-slate-400 hover:text-white')}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={clsx('px-4 py-2 rounded-lg text-sm font-medium transition-colors', viewMode === 'history' ? 'bg-primary-600 text-white' : 'bg-gym-card border border-gym-border text-slate-400 hover:text-white')}
          >
            View History
          </button>
        </div>
      )}

      {(viewMode === 'mark' || isMember) && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-400" />
              {isMember ? 'Your Attendance' : 'Daily Attendance Register'}
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field sm:ml-auto sm:w-auto"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gym-border">
                  <th className="table-header">Member</th>
                  {!isMember && <th className="table-header">Rate</th>}
                  <th className="table-header">Check In</th>
                  <th className="table-header text-center">Status</th>
                  {!isMember && <th className="table-header text-center">Mark</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border/50">
                {visibleMembers.map((member) => {
                  const rec = getAttendanceForDate(member.id, selectedDate);
                  const rate = memberAttendanceRate(member.id);
                  return (
                    <tr key={member.id} className="hover:bg-white/3 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white', member.avatarColor)}>
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">{member.name}</div>
                            <div className="text-xs text-slate-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      {!isMember && (
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-gym-border rounded-full overflow-hidden">
                              <div
                                className={clsx('h-full rounded-full', rate >= 75 ? 'bg-emerald-500' : rate >= 50 ? 'bg-amber-500' : 'bg-red-500')}
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400">{rate}%</span>
                          </div>
                        </td>
                      )}
                      <td className="table-cell text-slate-400 text-sm">
                        {rec?.checkIn || <span className="text-slate-600">—</span>}
                      </td>
                      <td className="table-cell text-center">
                        {rec ? (
                          <span className={clsx(
                            rec.status === 'present' ? 'badge-success' :
                            rec.status === 'late' ? 'badge-warning' : 'badge-danger'
                          )}>
                            {rec.status}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-xs">Not marked</span>
                        )}
                      </td>
                      {!isMember && (
                        <td className="table-cell">
                          <div className="flex items-center justify-center gap-1">
                            {STATUS_OPTS.map(({ value, label, icon: Icon, color, bg }) => (
                              <button
                                key={value}
                                onClick={() => markAttendance(member.id, selectedDate, value)}
                                title={label}
                                className={clsx(
                                  'p-1.5 rounded-lg border text-xs transition-all',
                                  rec?.status === value ? `${bg} ${color} border-opacity-100` : 'border-transparent text-slate-600 hover:border-slate-700'
                                )}
                              >
                                <Icon className={clsx('w-3.5 h-3.5', rec?.status === value ? color : '')} />
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'history' && !isMember && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-400" />
              Attendance History
            </h3>
            <select
              value={historyMember}
              onChange={(e) => setHistoryMember(e.target.value)}
              className="input-field sm:ml-auto sm:w-64"
            >
              <option value="">Select a member...</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {!historyMember ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>Select a member to view their attendance history</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-400">
                  Last 30 records for <strong className="text-white">{members.find((m) => m.id === historyMember)?.name}</strong>
                </div>
                <div className="text-sm font-semibold text-primary-400">
                  {memberAttendanceRate(historyMember)}% attendance rate
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {historyRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className={clsx(
                      'flex items-center gap-2 p-3 rounded-lg border text-sm',
                      rec.status === 'present' ? 'bg-emerald-900/10 border-emerald-800/30' :
                      rec.status === 'late' ? 'bg-amber-900/10 border-amber-800/30' :
                      'bg-red-900/10 border-red-800/30'
                    )}
                  >
                    {rec.status === 'present' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : rec.status === 'late' ? (
                      <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="text-slate-300 text-xs font-medium">{rec.date}</div>
                      <div className="text-slate-500 text-xs capitalize">{rec.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
