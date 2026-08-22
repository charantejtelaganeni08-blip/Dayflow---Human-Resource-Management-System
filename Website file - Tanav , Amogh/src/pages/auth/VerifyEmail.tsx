
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircleIcon, MailIcon } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export function VerifyEmail() {
  const { pendingUser, resendCode, cancelVerification } = useAuth();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setCooldown((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const email = pendingUser?.workEmail ?? '';

  const handleResend = async () => {
    if (!email || cooldown > 0 || resending) return;

    setError('');
    setMessage('');
    setResending(true);

    try {
      await resendCode();

      setMessage('A new confirmation email has been sent. Please check your inbox.');
      setCooldown(60);
    } catch (err) {
      console.error('Failed to resend confirmation email:', err);
      setError('Unable to resend the confirmation email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Check your inbox"
      subtitle={
        email
          ? `We sent a confirmation link to ${email}.`
          : 'We sent a confirmation link to your email address.'
      }
      footer={
        <button
          type="button"
          className="font-medium text-brand-600 hover:text-brand-700"
          onClick={cancelVerification}
        >
          Use a different account
        </button>
      }
    >
      <div className="flex flex-col gap-5">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700 ring-1 ring-inset ring-red-200"
          >
            <AlertCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div
            role="status"
            className="rounded-lg bg-green-50 px-3 py-2.5 text-xs text-green-700 ring-1 ring-inset ring-green-200"
          >
            {message}
          </div>
        )}

        <div className="flex flex-col items-center rounded-xl border border-hairline bg-white p-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
            <MailIcon className="h-6 w-6 text-brand-600" />
          </div>

          <h2 className="text-sm font-semibold text-ink">
            Confirm your email address
          </h2>

          <p className="mt-2 text-xs leading-5 text-ink-muted">
            Open the email from Dayflow and click the confirmation link.
            After your email is confirmed, return to Dayflow and continue.
          </p>
        </div>

        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={() => window.location.reload()}
        >
          I&apos;ve confirmed my email
        </Button>

        <button
          type="button"
          disabled={cooldown > 0 || resending || !email}
          onClick={handleResend}
          className="text-xs font-medium text-brand-600 disabled:text-ink-soft"
        >
          {resending
            ? 'Sending...'
            : cooldown > 0
              ? `Resend email in ${cooldown}s`
              : 'Resend confirmation email'}
        </button>

        <Link
          to="/signin"
          onClick={cancelVerification}
          className="text-center text-xs font-medium text-ink-muted hover:text-ink"
        >
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

