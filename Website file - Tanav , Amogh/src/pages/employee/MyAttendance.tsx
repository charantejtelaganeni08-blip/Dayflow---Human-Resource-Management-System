import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { AttendanceHistory } from '../../components/attendance/AttendanceHistory';
import { TodayPanel } from '../../components/employee/TodayPanel';
import { useAuth } from '../../contexts/AuthContext';

export function MyAttendance() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  return (
    <>
      <PageHeader
        title="My attendance"
        description="Your check-ins, hours and exceptions. Only you and HR can see this." />
      
      <div className="mb-5">
        <TodayPanel />
      </div>
      <AttendanceHistory employeeId={currentUser.id} />
    </>);

}