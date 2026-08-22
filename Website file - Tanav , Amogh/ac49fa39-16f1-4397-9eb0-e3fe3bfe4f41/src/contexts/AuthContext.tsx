import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Employee, Role } from '../types/hr';
import { useHRData } from './HRDataContext';
import { useScreenInit } from '../useScreenInit.js';

const DEMO_ADMIN_ID = 'EMP-1001';
const DEMO_EMPLOYEE_ID = 'EMP-1042';

interface SignUpInput {
  id: string;
  name: string;
  workEmail: string;
  password: string;
  role: Role;
}

interface AuthResult {
  ok: boolean;
  error?: string;
  needsVerification?: boolean;
}

interface AuthValue {
  currentUser: Employee | null;
  pendingUser: Employee | null;
  signUp: (input: SignUpInput) => AuthResult;
  signIn: (email: string, password: string) => AuthResult;
  verifyCode: (code: string) => AuthResult;
  resendCode: () => void;
  cancelVerification: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const { employees, addEmployee, verifyEmployee, getEmployee } = useHRData();
  const screenInit = useScreenInit() as {sessionRole?: string;};
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    if (screenInit.sessionRole === 'admin') return DEMO_ADMIN_ID;
    if (screenInit.sessionRole === 'employee') return DEMO_EMPLOYEE_ID;
    return null;
  });
  const [pendingUserId, setPendingUserId] = useState<string | null>(() =>
  screenInit.sessionRole === 'pending' ? DEMO_EMPLOYEE_ID : null
  );

  const currentUser = currentUserId ? getEmployee(currentUserId) ?? null : null;
  const pendingUser = pendingUserId ? getEmployee(pendingUserId) ?? null : null;

  const signUp = useCallback(
    (input: SignUpInput): AuthResult => {
      if (employees.some((employee) => employee.id.toLowerCase() === input.id.toLowerCase())) {
        return { ok: false, error: 'That Employee ID is already registered.' };
      }
      if (employees.some((employee) => employee.workEmail.toLowerCase() === input.workEmail.toLowerCase())) {
        return { ok: false, error: 'An account already exists for this email.' };
      }
      const employee = addEmployee(input);
      setPendingUserId(employee.id);
      return { ok: true, needsVerification: true };
    },
    [addEmployee, employees]
  );

  const signIn = useCallback(
    (email: string, password: string): AuthResult => {
      const employee = employees.find(
        (item) => item.workEmail.toLowerCase() === email.trim().toLowerCase()
      );
      if (!employee || employee.password !== password) {
        return { ok: false, error: 'Email or password is incorrect.' };
      }
      if (!employee.verified) {
        setPendingUserId(employee.id);
        return { ok: false, needsVerification: true, error: 'Verify your email to continue.' };
      }
      setCurrentUserId(employee.id);
      setPendingUserId(null);
      return { ok: true };
    },
    [employees]
  );

  const verifyCode = useCallback(
    (code: string): AuthResult => {
      if (!pendingUser) return { ok: false, error: 'No account is awaiting verification.' };
      if (code.trim() !== pendingUser.verificationCode) {
        return { ok: false, error: 'That code does not match. Check the email and try again.' };
      }
      verifyEmployee(pendingUser.id);
      setCurrentUserId(pendingUser.id);
      setPendingUserId(null);
      return { ok: true };
    },
    [pendingUser, verifyEmployee]
  );

  const resendCode = useCallback(() => {

    // The prototype keeps the same code; the cooldown is handled by the screen.
  }, []);
  const cancelVerification = useCallback(() => setPendingUserId(null), []);

  const signOut = useCallback(() => {
    setCurrentUserId(null);
    setPendingUserId(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      currentUser,
      pendingUser,
      signUp,
      signIn,
      verifyCode,
      resendCode,
      cancelVerification,
      signOut
    }),
    [currentUser, pendingUser, signUp, signIn, verifyCode, resendCode, cancelVerification, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}