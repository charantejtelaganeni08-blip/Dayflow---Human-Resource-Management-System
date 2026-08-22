
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Employee, Role } from '../types/hr';
import { supabase } from '../lib/supabase';

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
  signUp: (input: SignUpInput) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  verifyCode: (code: string) => Promise<AuthResult>;
  resendCode: () => Promise<void>;
  cancelVerification: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);

  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

function mapEmployee(row: any): Employee {
  const salary = Number(row.salary ?? 0);

  return {
    id: row.id,
    name: `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim(),
    workEmail: row.work_email ?? '',
    personalEmail: '',
    phone: row.phone_number ?? '',
    address: '',
    emergency: {
      name: '',
      relationship: '',
      phone: '',
    },
    department: row.department ?? 'Unassigned',
    designation: row.position ?? 'Employee',
    manager: '',
    employmentType: 'Full-time',
    joinDate: row.hire_date ?? '',
    employmentStatus: 'Active',
    role: row.is_admin ? 'admin' : 'employee',
    password: '',
    verified: true,
    verificationCode: '',
    balances: {
      casual: { total: 12, used: 0 },
      sick: { total: 10, used: 0 },
      earned: { total: 18, used: 0 },
      unpaid: { total: 0, used: 0 },
    },
    salary: {
      basic: salary,
      hra: 0,
      allowances: 0,
      tax: 0,
      pf: 0,
    },
  };
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [pendingUser, setPendingUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  const loadEmployee = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Failed to load employee:', error);
      return null;
    }

    return data ? mapEmployee(data) : null;
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        const employee = await loadEmployee(session.user.id);

        if (mounted) {
          setCurrentUser(employee);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const employee = await loadEmployee(session.user.id);

      if (mounted) {
        setCurrentUser(employee);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadEmployee]);

  const signUp = useCallback(
    async (input: SignUpInput): Promise<AuthResult> => {
      const { firstName, lastName } = splitName(input.name);

      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email: input.workEmail.trim().toLowerCase(),
        password: input.password,
        options: {
          data: {
            employee_code: input.id.toUpperCase(),
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        return {
          ok: false,
          error: error.message,
        };
      }

      if (!user) {
        return {
          ok: false,
          error: 'Unable to create the account.',
        };
      }

      setPendingUser({
        id: user.id,
        name: input.name,
        workEmail: input.workEmail.trim().toLowerCase(),
        personalEmail: '',
        phone: '',
        address: '',
        emergency: {
          name: '',
          relationship: '',
          phone: '',
        },
        department: 'Unassigned',
        designation: 'New Joiner',
        manager: '',
        employmentType: 'Full-time',
        joinDate: new Date().toISOString().slice(0, 10),
        employmentStatus: 'Active',
        role: 'employee',
        password: '',
        verified: false,
        verificationCode: '',
        balances: {
          casual: { total: 12, used: 0 },
          sick: { total: 10, used: 0 },
          earned: { total: 18, used: 0 },
          unpaid: { total: 0, used: 0 },
        },
        salary: {
          basic: 0,
          hra: 0,
          allowances: 0,
          tax: 0,
          pf: 0,
        },
      });

      return {
        ok: true,
        needsVerification: true,
      };
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return {
          ok: false,
          error: 'Email or password is incorrect.',
        };
      }

      return { ok: true };
    },
    []
  );

  const verifyCode = useCallback(async (): Promise<AuthResult> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        ok: false,
        error: 'No authenticated user found.',
      };
    }

    if (!user.email_confirmed_at) {
      return {
        ok: false,
        error: 'Please verify your email before continuing.',
      };
    }

    const employee = await loadEmployee(user.id);

    if (!employee) {
      return {
        ok: false,
        error: 'Your employee profile could not be found.',
      };
    }

    setCurrentUser(employee);
    setPendingUser(null);

    return { ok: true };
  }, [loadEmployee]);

  const resendCode = useCallback(async () => {
    if (!pendingUser?.workEmail) return;

    await supabase.auth.resend({
      type: 'signup',
      email: pendingUser.workEmail,
    });
  }, [pendingUser]);

  const cancelVerification = useCallback(() => {
    setPendingUser(null);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setPendingUser(null);
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
      signOut,
    }),
    [
      currentUser,
      pendingUser,
      signUp,
      signIn,
      verifyCode,
      resendCode,
      cancelVerification,
      signOut,
    ]
  );

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

