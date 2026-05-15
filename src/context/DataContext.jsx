import { createContext, useContext, useState } from 'react';
import {
  MEMBERS as INITIAL_MEMBERS,
  TRAINERS as INITIAL_TRAINERS,
  ATTENDANCE_RECORDS as INITIAL_ATTENDANCE,
  PAYMENTS as INITIAL_PAYMENTS,
} from '../data/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [trainers] = useState(INITIAL_TRAINERS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);

  const addMember = (member) => {
    const newMember = {
      ...member,
      id: `m${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      avatarColor: 'bg-primary-600',
    };
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const updateMember = (id, updates) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const markAttendance = (memberId, date, status) => {
    const existingIdx = attendance.findIndex(
      (a) => a.memberId === memberId && a.date === date
    );
    const record = {
      id: `att-${memberId}-${date}`,
      memberId,
      date,
      status,
      checkIn: status !== 'absent' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
      checkOut: null,
    };
    if (existingIdx >= 0) {
      setAttendance((prev) => prev.map((a, i) => (i === existingIdx ? record : a)));
    } else {
      setAttendance((prev) => [...prev, record]);
    }
  };

  const addPayment = (payment) => {
    const newPayment = { ...payment, id: `pay${Date.now()}` };
    setPayments((prev) => [...prev, newPayment]);
    return newPayment;
  };

  const updatePaymentStatus = (id, status) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  return (
    <DataContext.Provider
      value={{
        members,
        trainers,
        attendance,
        payments,
        addMember,
        updateMember,
        deleteMember,
        markAttendance,
        addPayment,
        updatePaymentStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
