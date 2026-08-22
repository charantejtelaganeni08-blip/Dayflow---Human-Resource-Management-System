import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { useAuth } from '../../contexts/AuthContext';
import type { Role } from '../../types/hr';
import {
  isValidEmployeeId,
  isValidWorkEmail,
  passwordRules,
  passwordScore,
  passwordStrength } from
'../../utils/password';
import { cn } from '../../utils/cn';

export function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<Role>('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const strength = passwordStrength(password);
  const rulesPassed = passwordScore(password) === passwordRules.length;
  const idValid = isValidEmployeeId(employeeId);
  const emailValid = isValidWorkEmail(email);
  const matches = password.length > 0 && password === confirm;

  const canSubmit = useMemo(
    () => idValid && emailValid && name.trim().length > 1 && rulesPassed && matches,
    [idValid, emailValid, name, rulesPassed, matches]
  );

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Register with the Employee ID your HR team issued you."
      footer={
      <span>
          Already registered?{' '}
          <Link to="/signin" className="font-medium text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </span>
      }>
      
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const result = signUp({
            id: employeeId.toUpperCase(),
            name: name.trim(),
            workEmail: email.trim().toLowerCase(),
            password,
            role
          });
          if (!result.ok) {
            setError(result.error ?? 'Unable to create the account.');
            return;
          }
          navigate('/verify');
        }}>
        
        {error &&
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700 ring-1 ring-inset ring-red-200">
          
            <AlertCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        }

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Employee ID"
            htmlFor="signup-id"
            hint={employeeId && !idValid ? undefined : 'Format: EMP-1234'}
            error={employeeId && !idValid ? 'Use the format EMP-1234.' : undefined}>
            
            <input
              id="signup-id"
              className={inputClass}
              placeholder="EMP-1234"
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
              required />
            
          </Field>
          <Field label="Full name" htmlFor="signup-name">
            <input
              id="signup-name"
              className={inputClass}
              placeholder="Ananya Sharma"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required />
            
          </Field>
        </div>

        <Field
          label="Work email"
          htmlFor="signup-email"
          error={email && !emailValid ? 'Enter a valid email address.' : undefined}>
          
          <input
            id="signup-email"
            type="email"
            className={inputClass}
            placeholder="ananya@peopledesk.io"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required />
          
        </Field>

        <Field label="Role">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            {(['employee', 'admin'] as Role[]).map((option) =>
            <button
              key={option}
              type="button"
              onClick={() => setRole(option)}
              aria-pressed={role === option}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ease-soft',
                role === option ? 'bg-white text-ink shadow-panel' : 'text-ink-muted hover:text-ink'
              )}>
              
                {option === 'employee' ? 'Employee' : 'Admin / HR'}
              </button>
            )}
          </div>
        </Field>

        <Field label="Password" htmlFor="signup-password">
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              className={`${inputClass} pr-10`}
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

        <div>
          <div className="flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className={cn(
                  'h-full rounded-full transition-[width] duration-200 ease-soft',
                  strength.tone,
                  password ? strength.width : 'w-0'
                )} />
              
            </div>
            <span className="w-12 text-right text-xs text-ink-muted">
              {password ? strength.label : ''}
            </span>
          </div>
          <ul className="mt-2.5 grid grid-cols-2 gap-1.5">
            {passwordRules.map((rule) => {
              const passed = rule.test(password);
              return (
                <li
                  key={rule.id}
                  className={cn(
                    'flex items-center gap-1.5 text-xs',
                    passed ? 'text-green-700' : 'text-ink-soft'
                  )}>
                  
                  <CheckIcon className={cn('h-3.5 w-3.5', passed ? 'opacity-100' : 'opacity-30')} />
                  {rule.label}
                </li>);

            })}
          </ul>
        </div>

        <Field
          label="Confirm password"
          htmlFor="signup-confirm"
          error={confirm && !matches ? 'Passwords do not match.' : undefined}>
          
          <input
            id="signup-confirm"
            type="password"
            className={inputClass}
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            required />
          
        </Field>

        <Button type="submit" size="lg" disabled={!canSubmit} className="mt-1 w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>);

}