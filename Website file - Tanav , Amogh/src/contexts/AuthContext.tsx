
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

function mapEmployee(row: any): Employee {
  return {
    ...row,
    workEmail: row.workEmail ?? row.work_email ?? '',
    userId: row.userId ?? row.user_id ?? undefined,
  } as Employee;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user) {
        setCurrentUser(null);
        return;
      }

      if (
        event === 'SIGNED_IN' ||
        event === 'INITIAL_SESSION' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        const employee = await loadEmployee(session.user.id);

        if (mounted) {
          setCurrentUser(employee);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadEmployee]);

  const signUp = useCallback(
    async (input: SignUpInput): Promise<AuthResult> => {
      const email = input.workEmail.trim().toLowerCase();

      const { data, error } = await supabase.auth.signUp({
        email,
        password: input.password,
        options: {
          data: {
            employee_id: input.id,
            name: input.name,
            role: input.role,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        return {
          ok: false,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          ok: false,
          error: 'Unable to create the account.',
        };
      }

      /*
       * With Supabase email confirmation enabled, signup normally
       * returns a user without an active session.
       *
       * The employee record must be created by the database-side
       * auth trigger/function, not by the browser.
       */
      if (!data.session) {
        return {
          ok: true,
          needsVerification: true,
        };
      }

      const employee = await loadEmployee(data.user.id);

      if (employee) {
        setCurrentUser(employee);
      }

      return {
        ok: true,
      };
    },
    [loadEmployee]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return {
          ok: false,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          ok: false,
          error: 'Unable to sign in.',
        };
      }

      const employee = await loadEmployee(data.user.id);

      if (!employee) {
        await supabase.auth.signOut();

        return {
          ok: false,
          error:
            'Your authentication account exists, but your employee profile has not been created yet.',
        };
      }

      setCurrentUser(employee);
      setPendingUser(null);

      return {
        ok: true,
      };
    },
    [loadEmployee]
  );

  /*
   * Supabase email confirmation uses the confirmation link/OTP.
   *
   * The existing UI can continue calling verifyCode(), but the actual
   * verification is now handled by Supabase Auth.
   */
  const verifyCode = useCallback(async (_code: string): Promise<AuthResult> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const employee = await loadEmployee(session.user.id);

      if (employee) {
        setCurrentUser(employee);
        setPendingUser(null);

        return {
          ok: true,
        };
      }
    }

    return {
      ok: false,
      error:
        'Please use the verification link sent to your email, then return to the application.',
    };
  }, [loadEmployee]);

  const resendCode = useCallback(async () => {
    if (!pendingUser?.workEmail) return;

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: pendingUser.workEmail,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Failed to resend verification email:', error);
    }
  }, [pendingUser]);

  const cancelVerification = useCallback(() => {
    setPendingUser(null);
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out failed:', error);
      return;
    }

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

