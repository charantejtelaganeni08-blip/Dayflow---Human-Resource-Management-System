import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { useAuth } from '../../contexts/AuthContext';

const demoAccounts = [
{ label: 'Priya Menon · Admin/HR', email: 'priya@peopledesk.io' },
{ label: 'Arjun Rao · Employee', email: 'arjun@peopledesk.io' }];


export function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const attempt = (nextEmail: string, nextPassword: string) => {
    setSubmitting(true);
    setError('');
    const result = signIn(nextEmail, nextPassword);
    setSubmitting(false);
    if (result.ok) {
      navigate('/', { replace: true });
      return;
    }
    if (result.needsVerification) {
      navigate('/verify');
      return;
    }
    setError(result.error ?? 'Unable to sign in.');
  };

  return (
    <AuthLayout
      title="Sign in to PeopleDesk"
      subtitle="Use your work email and password."
      footer={
      <span>
          New here?{' '}
          <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </span>
      }>
      
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          attempt(email, password);
        }}>
        
        {error &&
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700 ring-1 ring-inset ring-red-200">
          
            <AlertCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        }

        <Field label="Work email" htmlFor="signin-email">
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="you@peopledesk.io"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required />
          
        </Field>

        <Field label="Password" htmlFor="signin-password">
          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`${inputClass} pr-10`}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required />
            
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-soft transition-colors duration-150 ease-soft hover:bg-slate-100 hover:text-ink">
              
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-ink-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-hairline text-brand-600 focus:ring-brand-500" />
            
            Remember me
          </label>
          <button
            type="button"
            onClick={() => setError('Password resets are not available in this prototype.')}
            className="text-xs font-medium text-brand-600 hover:text-brand-700">
            
            Forgot password?
          </button>
        </div>

        <Button type="submit" size="lg" disabled={submitting} className="mt-1 w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-8 rounded-lg border border-hairline bg-white p-4">
        <p className="text-xs font-medium text-ink">Demo accounts</p>
        <p className="mt-0.5 text-xs text-ink-muted">One tap to sign in as either role.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {demoAccounts.map((account) =>
          <Button
            key={account.email}
            variant="secondary"
            size="sm"
            onClick={() => {
              setEmail(account.email);
              setPassword('Password@123');
              attempt(account.email, 'Password@123');
            }}>
            
              {account.label}
            </Button>
          )}
        </div>
      </div>
    </AuthLayout>);

}