import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { ProfileForm } from '../components/profile/ProfileForm';
import { useAuth } from '../contexts/AuthContext';

export function Profile() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  return (
    <>
      <PageHeader
        title="Profile"
        description={
        currentUser.role === 'admin' ?
        'Your own record. Open a person from Employees to edit theirs.' :
        'Update your contact details. Employment fields are maintained by HR.'
        } />
      
      <ProfileForm employee={currentUser} canEditAll={currentUser.role === 'admin'} />
    </>);

}