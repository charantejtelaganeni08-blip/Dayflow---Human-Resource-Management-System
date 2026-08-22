import React, { useRef } from 'react';
import { CameraIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { ProfileSection } from './ProfileSection';
import type { ProfileField } from './ProfileSection';
import { useHRData } from '../../contexts/HRDataContext';
import type { Employee } from '../../types/hr';

interface ProfileFormProps {
  employee: Employee;
  canEditAll: boolean;
}

export function ProfileForm({ employee, canEditAll }: ProfileFormProps) {
  const { updateEmployee } = useHRData();
  const fileRef = useRef<HTMLInputElement>(null);

  const save = (patch: Partial<Employee>) => {
    updateEmployee(employee.id, patch);
    toast.success('Profile updated');
  };

  const personal: ProfileField[] = [
  { key: 'name', label: 'Full name', value: employee.name, editable: canEditAll },
  { key: 'id', label: 'Employee ID', value: employee.id, editable: false },
  { key: 'workEmail', label: 'Work email', value: employee.workEmail, editable: canEditAll, type: 'email' },
  {
    key: 'personalEmail',
    label: 'Personal email',
    value: employee.personalEmail,
    editable: true,
    type: 'email'
  }];


  const employment: ProfileField[] = [
  { key: 'department', label: 'Department', value: employee.department, editable: canEditAll },
  { key: 'designation', label: 'Designation', value: employee.designation, editable: canEditAll },
  { key: 'manager', label: 'Reporting manager', value: employee.manager, editable: canEditAll },
  {
    key: 'employmentType',
    label: 'Employment type',
    value: employee.employmentType,
    editable: canEditAll,
    options: ['Full-time', 'Part-time', 'Contract']
  },
  { key: 'joinDate', label: 'Join date', value: employee.joinDate, editable: canEditAll, type: 'date' },
  {
    key: 'employmentStatus',
    label: 'Status',
    value: employee.employmentStatus,
    editable: canEditAll,
    options: ['Active', 'On notice', 'Inactive']
  }];


  const contact: ProfileField[] = [
  { key: 'phone', label: 'Phone', value: employee.phone, editable: true, type: 'tel' },
  { key: 'address', label: 'Address', value: employee.address, editable: true, type: 'textarea' }];


  const emergency: ProfileField[] = [
  { key: 'emergency.name', label: 'Contact name', value: employee.emergency.name, editable: true },
  {
    key: 'emergency.relationship',
    label: 'Relationship',
    value: employee.emergency.relationship,
    editable: true
  },
  { key: 'emergency.phone', label: 'Phone', value: employee.emergency.phone, editable: true, type: 'tel' }];


  return (
    <div className="flex flex-col gap-5">
      <Panel>
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name={employee.name} src={employee.avatarUrl} size="xl" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold text-ink">{employee.name}</p>
            <p className="text-sm text-ink-muted">
              {employee.designation} · {employee.department}
            </p>
            <p className="mt-0.5 text-xs text-ink-soft">
              {employee.id} · joined {employee.joinDate}
            </p>
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  save({ avatarUrl: String(reader.result) });
                };
                reader.readAsDataURL(file);
              }} />
            
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <CameraIcon className="h-4 w-4" />
              Change photo
            </Button>
          </div>
        </div>
      </Panel>

      <ProfileSection
        title="Personal"
        description={canEditAll ? undefined : 'Name and work email are maintained by HR.'}
        fields={personal}
        onSave={(values) =>
        save({
          name: values.name,
          workEmail: values.workEmail,
          personalEmail: values.personalEmail
        })
        } />
      

      <ProfileSection
        title="Employment"
        description={canEditAll ? 'Visible to the employee, editable only by HR.' : 'Managed by HR.'}
        fields={employment}
        onSave={(values) =>
        save({
          department: values.department,
          designation: values.designation,
          manager: values.manager,
          employmentType: values.employmentType as Employee['employmentType'],
          joinDate: values.joinDate,
          employmentStatus: values.employmentStatus as Employee['employmentStatus']
        })
        } />
      

      <ProfileSection
        title="Contact"
        fields={contact}
        onSave={(values) => save({ phone: values.phone, address: values.address })} />
      

      <ProfileSection
        title="Emergency contact"
        fields={emergency}
        onSave={(values) =>
        save({
          emergency: {
            name: values['emergency.name'],
            relationship: values['emergency.relationship'],
            phone: values['emergency.phone']
          }
        })
        } />
      
    </div>);

}