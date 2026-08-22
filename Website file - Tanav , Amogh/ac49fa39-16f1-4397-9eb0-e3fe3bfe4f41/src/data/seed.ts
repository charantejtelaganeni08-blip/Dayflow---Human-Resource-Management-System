import { addDays, format, isWeekend, subDays, subMonths } from 'date-fns';
import type {
  AttendanceRecord,
  AppNotification,
  Employee,
  LeaveRequest,
  Payslip,
  SalaryStructure } from
'../types/hr';
import { ISO } from '../utils/date';

function rng(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

const random = rng(20260821);

function salary(basic: number): SalaryStructure {
  return {
    basic,
    hra: Math.round(basic * 0.4),
    allowances: Math.round(basic * 0.2),
    tax: Math.round(basic * 0.12),
    pf: Math.round(basic * 0.12)
  };
}

function balances(casualUsed: number, sickUsed: number, earnedUsed: number) {
  return {
    casual: { total: 12, used: casualUsed },
    sick: { total: 10, used: sickUsed },
    earned: { total: 18, used: earnedUsed },
    unpaid: { total: 0, used: 0 }
  };
}

type Sketch = {
  id: string;
  name: string;
  department: string;
  designation: string;
  manager: string;
  role: 'admin' | 'employee';
  basic: number;
  used: [number, number, number];
};

const sketches: Sketch[] = [
{ id: 'EMP-1001', name: 'Priya Menon', department: 'People Ops', designation: 'Head of HR', manager: 'Rajiv Bansal', role: 'admin', basic: 145000, used: [3, 1, 4] },
{ id: 'EMP-1042', name: 'Arjun Rao', department: 'Engineering', designation: 'Senior Engineer', manager: 'Neha Kulkarni', role: 'employee', basic: 118000, used: [5, 2, 6] },
{ id: 'EMP-1043', name: 'Neha Kulkarni', department: 'Engineering', designation: 'Engineering Manager', manager: 'Rajiv Bansal', role: 'employee', basic: 152000, used: [2, 0, 8] },
{ id: 'EMP-1044', name: 'Ishaan Verma', department: 'Engineering', designation: 'Frontend Engineer', manager: 'Neha Kulkarni', role: 'employee', basic: 92000, used: [7, 4, 2] },
{ id: 'EMP-1045', name: 'Sara Fernandes', department: 'Design', designation: 'Product Designer', manager: 'Kabir Shah', role: 'employee', basic: 98000, used: [1, 3, 5] },
{ id: 'EMP-1046', name: 'Kabir Shah', department: 'Design', designation: 'Design Lead', manager: 'Rajiv Bansal', role: 'employee', basic: 126000, used: [4, 1, 3] },
{ id: 'EMP-1047', name: 'Meera Iyer', department: 'Finance', designation: 'Financial Analyst', manager: 'Rajiv Bansal', role: 'employee', basic: 88000, used: [6, 5, 1] },
{ id: 'EMP-1048', name: 'Dev Patel', department: 'Sales', designation: 'Account Executive', manager: 'Rhea Kapoor', role: 'employee', basic: 84000, used: [8, 2, 7] },
{ id: 'EMP-1049', name: 'Rhea Kapoor', department: 'Sales', designation: 'Sales Manager', manager: 'Rajiv Bansal', role: 'employee', basic: 132000, used: [2, 2, 9] },
{ id: 'EMP-1050', name: 'Aditya Nair', department: 'Engineering', designation: 'Backend Engineer', manager: 'Neha Kulkarni', role: 'employee', basic: 105000, used: [3, 6, 2] },
{ id: 'EMP-1051', name: 'Tanvi Joshi', department: 'People Ops', designation: 'HR Associate', manager: 'Priya Menon', role: 'employee', basic: 72000, used: [5, 1, 4] },
{ id: 'EMP-1052', name: 'Farhan Qureshi', department: 'Support', designation: 'Support Specialist', manager: 'Priya Menon', role: 'employee', basic: 68000, used: [9, 3, 3] }];


const cities = ['Bengaluru', 'Pune', 'Mumbai', 'Hyderabad', 'Chennai'];

export function buildEmployees(): Employee[] {
  return sketches.map((sketch, index) => {
    const slug = sketch.name.toLowerCase().split(' ')[0];
    return {
      id: sketch.id,
      name: sketch.name,
      workEmail: `${slug}@peopledesk.io`,
      personalEmail: `${slug}.${sketch.id.slice(-4)}@gmail.com`,
      phone: `+91 98${String(10000000 + index * 13571).slice(0, 8)}`,
      address: `${12 + index} Lakeview Residency, ${cities[index % cities.length]} 5600${String(index).padStart(2, '0')}`,
      emergency: {
        name: index % 2 === 0 ? 'Anita ' + sketch.name.split(' ')[1] : 'Rohit ' + sketch.name.split(' ')[1],
        relationship: index % 2 === 0 ? 'Spouse' : 'Sibling',
        phone: `+91 90${String(20000000 + index * 24680).slice(0, 8)}`
      },
      department: sketch.department,
      designation: sketch.designation,
      manager: sketch.manager,
      employmentType: index === 11 ? 'Contract' : 'Full-time',
      joinDate: format(subDays(new Date(), 300 + index * 97), ISO),
      employmentStatus: 'Active',
      role: sketch.role,
      password: 'Password@123',
      verified: true,
      verificationCode: '482915',
      balances: balances(sketch.used[0], sketch.used[1], sketch.used[2]),
      salary: salary(sketch.basic)
    };
  });
}

function timeAt(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function buildAttendance(employees: Employee[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const start = subDays(new Date(), 74);

  employees.forEach((employee, employeeIndex) => {
    for (let offset = 0; offset < 75; offset += 1) {
      const day = addDays(start, offset);
      if (isWeekend(day)) continue;
      const date = format(day, ISO);
      if (date >= format(new Date(), ISO)) continue;

      const roll = random();
      let status: AttendanceRecord['status'] = 'present';
      if (roll > 0.94) status = 'absent';else
      if (roll > 0.88) status = 'half-day';else
      if (roll > 0.82) status = 'leave';

      const lateness = random();
      const inHour = 9;
      const inMinute = lateness > 0.75 ? 40 + Math.floor(random() * 18) : 5 + Math.floor(random() * 22);
      const checkIn = timeAt(inHour, Math.min(inMinute, 59));
      const outHour = status === 'half-day' ? 13 : 18;
      const checkOut = timeAt(outHour, 5 + Math.floor(random() * 45));

      records.push({
        id: `att-${employee.id}-${date}`,
        employeeId: employee.id,
        date,
        status,
        checkIn: status === 'absent' || status === 'leave' ? undefined : checkIn,
        checkOut: status === 'absent' || status === 'leave' ? undefined : checkOut,
        note: status === 'leave' ? 'Approved leave' : undefined
      });
    }

    // Today: most of the team is already checked in, a few are not.
    const today = format(new Date(), ISO);
    if (employeeIndex % 5 !== 1 && employee.id !== 'EMP-1042') {
      records.push({
        id: `att-${employee.id}-${today}`,
        employeeId: employee.id,
        date: today,
        status: 'present',
        checkIn: timeAt(9, 5 + employeeIndex * 7 % 40)
      });
    }
  });

  return records;
}

export function buildLeaveRequests(employees: Employee[]): LeaveRequest[] {
  const now = new Date();
  const iso = (date: Date) => format(date, ISO);

  const requests: LeaveRequest[] = [
  {
    id: 'lv-001',
    employeeId: 'EMP-1044',
    type: 'sick',
    from: iso(addDays(now, 1)),
    to: iso(addDays(now, 2)),
    days: 2,
    remarks: 'Down with a viral fever, doctor advised two days of rest.',
    status: 'pending',
    appliedAt: subDays(now, 1).toISOString()
  },
  {
    id: 'lv-002',
    employeeId: 'EMP-1048',
    type: 'casual',
    from: iso(addDays(now, 5)),
    to: iso(addDays(now, 7)),
    days: 3,
    remarks: 'Family wedding in Jaipur.',
    status: 'pending',
    appliedAt: subDays(now, 2).toISOString()
  },
  {
    id: 'lv-003',
    employeeId: 'EMP-1045',
    type: 'earned',
    from: iso(addDays(now, 12)),
    to: iso(addDays(now, 19)),
    days: 6,
    remarks: 'Annual holiday, flights already booked.',
    status: 'pending',
    appliedAt: subDays(now, 3).toISOString()
  },
  {
    id: 'lv-004',
    employeeId: 'EMP-1042',
    type: 'casual',
    from: iso(subDays(now, 14)),
    to: iso(subDays(now, 13)),
    days: 2,
    remarks: 'Moving apartments.',
    status: 'approved',
    decisionComment: 'Approved — please hand over the release checklist.',
    decidedBy: 'EMP-1001',
    appliedAt: subDays(now, 18).toISOString(),
    decidedAt: subDays(now, 17).toISOString()
  },
  {
    id: 'lv-005',
    employeeId: 'EMP-1042',
    type: 'sick',
    from: iso(subDays(now, 32)),
    to: iso(subDays(now, 32)),
    days: 1,
    remarks: 'Migraine.',
    status: 'approved',
    decidedBy: 'EMP-1001',
    appliedAt: subDays(now, 33).toISOString(),
    decidedAt: subDays(now, 32).toISOString()
  },
  {
    id: 'lv-006',
    employeeId: 'EMP-1050',
    type: 'unpaid',
    from: iso(subDays(now, 8)),
    to: iso(subDays(now, 4)),
    days: 4,
    remarks: 'Extended personal travel.',
    status: 'rejected',
    decisionComment: 'Overlaps with the platform migration window — please re-plan for next month.',
    decidedBy: 'EMP-1001',
    appliedAt: subDays(now, 12).toISOString(),
    decidedAt: subDays(now, 10).toISOString()
  },
  {
    id: 'lv-007',
    employeeId: 'EMP-1052',
    type: 'casual',
    from: iso(subDays(now, 40)),
    to: iso(subDays(now, 39)),
    days: 2,
    remarks: 'Personal work.',
    status: 'approved',
    decidedBy: 'EMP-1001',
    appliedAt: subDays(now, 44).toISOString(),
    decidedAt: subDays(now, 43).toISOString()
  }];


  return requests.filter((request) => employees.some((employee) => employee.id === request.employeeId));
}

export function buildPayslips(employees: Employee[]): Payslip[] {
  const slips: Payslip[] = [];
  employees.forEach((employee) => {
    for (let back = 1; back <= 4; back += 1) {
      const month = format(subMonths(new Date(), back), 'yyyy-MM');
      slips.push({
        id: `slip-${employee.id}-${month}`,
        employeeId: employee.id,
        month,
        published: true,
        structure: employee.salary
      });
    }
    slips.push({
      id: `slip-${employee.id}-${format(new Date(), 'yyyy-MM')}`,
      employeeId: employee.id,
      month: format(new Date(), 'yyyy-MM'),
      published: false,
      structure: employee.salary
    });
  });
  return slips;
}

export function buildNotifications(): AppNotification[] {
  const now = new Date();
  return [
  {
    id: 'ntf-001',
    employeeId: 'EMP-1001',
    title: 'New leave request',
    body: 'Ishaan Verma requested 2 days of sick leave.',
    at: subDays(now, 0).toISOString(),
    read: false,
    href: '/admin/leave'
  },
  {
    id: 'ntf-002',
    employeeId: 'EMP-1001',
    title: 'Attendance exception',
    body: '2 people have not checked in yet today.',
    at: new Date(now.getTime() - 3 * 3600000).toISOString(),
    read: false,
    href: '/admin/attendance'
  },
  {
    id: 'ntf-003',
    employeeId: 'EMP-1001',
    title: 'Payroll not published',
    body: 'This month’s payroll is still in draft.',
    at: subDays(now, 2).toISOString(),
    read: true,
    href: '/admin/payroll'
  },
  {
    id: 'ntf-004',
    employeeId: 'EMP-1042',
    title: 'Leave approved',
    body: 'Your casual leave was approved by Priya Menon.',
    at: subDays(now, 1).toISOString(),
    read: false,
    href: '/leave'
  },
  {
    id: 'ntf-005',
    employeeId: 'EMP-1042',
    title: 'Payslip published',
    body: `Your payslip for ${format(subMonths(now, 1), 'MMMM yyyy')} is ready.`,
    at: subDays(now, 4).toISOString(),
    read: true,
    href: '/payslips'
  }];

}