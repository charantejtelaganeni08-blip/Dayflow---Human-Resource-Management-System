
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, MailIcon } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { maskEmail } from '../../utils/format';

export function VerifyEmail() {
  const { pendingUser, resendCode, cancelVerification } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setTimeout(
      () => setCooldown((value) => value - 1),
      1000
    );

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  if (!pendingUser) {
    return <Navigate to="/signin" replace />;
  }

  const handleResend = async () => {
    setError('');

    try {
      await resendCode();
      setSent(true);
      setCooldown(60);
    } catch {
      setError('Unable to resend the confirmation email. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Check your inbox"
      subtitle={`We sent a confirmation link to ${maskEmail(
        pendingUser.workEmail
      )}.`}
      footer={
        <button
          type="button"
          className="font-medium text-brand-600 hover:text-brand-700"
          onClick={() => {
            cancelVerification();
            navigate('/signin');
          }}
        >
          Use a different account
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700 ring-1 ring-inset ring-red-200"
          >
            <AlertCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {sent && (
          <div className="rounded-lg bg-green-50 px-3 py-2.5 text-xs text-green-700 ring-1 ring-inset ring-green-200">
            A new confirmation email has been sent.
          </div>
        )}

        <div className="rounded-lg border border-hairline bg-white p-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
            <MailIcon className="h-5 w-5 text-brand-600" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-ink">
            Confirm your email address
          </h3>

          <p className="mt-2 text-xs leading-5 text-ink-muted">
            Open the email from Dayflow and click the confirmation link.
            After your email is confirmed, you can sign in normally.
          </p>
        </div>

        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={() => navigate('/signin')}
        >
          Go to sign in
        </Button>

        <div className="flex items-center justify-center text-xs">
          <button
            type="button"
            disabled={cooldown > 0}
            onClick={handleResend}
            className="font-medium text-brand-600 disabled:text-ink-soft"
          >
            {cooldown > 0
              ? `Resend email in ${cooldown}s`
              : 'Resend confirmation email'}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

