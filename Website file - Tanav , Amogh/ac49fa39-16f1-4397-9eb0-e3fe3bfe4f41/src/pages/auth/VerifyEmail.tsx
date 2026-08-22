import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, MailIcon } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { useAuth } from '../../contexts/AuthContext';
import { maskEmail } from '../../utils/format';

export function VerifyEmail() {
  const { pendingUser, verifyCode, resendCode, cancelVerification } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  if (!pendingUser) return <Navigate to="/signin" replace />;

  return (
    <AuthLayout
      title="Check your inbox"
      subtitle={`We sent a 6-digit code to ${maskEmail(pendingUser.workEmail)}.`}
      footer={
      <button
        type="button"
        className="font-medium text-brand-600 hover:text-brand-700"
        onClick={() => {
          cancelVerification();
          navigate('/signin');
        }}>
        
          Use a different account
        </button>
      }>
      
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const result = verifyCode(code);
          if (!result.ok) {
            setError(result.error ?? 'Verification failed.');
            return;
          }
          navigate('/', { replace: true });
        }}>
        
        {error &&
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700 ring-1 ring-inset ring-red-200">
          
            <AlertCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        }

        <Field label="Verification code" htmlFor="verify-code">
          <input
            id="verify-code"
            inputMode="numeric"
            maxLength={6}
            className={`${inputClass} text-center text-lg tracking-[0.5em]`}
            placeholder="000000"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
            required />
          
        </Field>

        <Button type="submit" size="lg" disabled={code.length !== 6} className="w-full">
          Verify and continue
        </Button>

        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            disabled={cooldown > 0}
            onClick={() => {
              resendCode();
              setCooldown(60);
            }}
            className="font-medium text-brand-600 disabled:text-ink-soft">
            
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
          </button>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink">
            
            <MailIcon className="h-3.5 w-3.5" />
            Simulate email
          </button>
        </div>

        {revealed &&
        <div className="rounded-lg border border-hairline bg-white p-4 text-xs text-ink-muted">
            <p className="font-medium text-ink">Simulated email</p>
            <p className="mt-1">
              Your PeopleDesk verification code is{' '}
              <span className="font-semibold tracking-widest text-ink">
                {pendingUser.verificationCode}
              </span>
              .
            </p>
          </div>
        }
      </form>
    </AuthLayout>);

}