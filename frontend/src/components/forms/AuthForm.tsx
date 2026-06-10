import { useState, type FormEvent } from 'react';
import { AlertTriangle, Eye, EyeOff } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from 'reactstrap';

import { buttonSize, buttonStyle } from '../../constants/constants';
import type { Credentials } from '../../constants/types';
import { useLogin, useRegister } from '../../hooks/mutations';
import { useHealth } from '../../hooks/queries';
import PopupWrapper from '../features/PopupWrapper';

type AuthMode = 'login' | 'register';

const APP_PATHS_AFTER_LOGIN = ['/articles', '/likes', '/read-again', '/stats'] as const;

function postLoginPath(state: unknown): string {
  const from = (state as { from?: string } | null)?.from;
  if (from && (APP_PATHS_AFTER_LOGIN as readonly string[]).includes(from)) {
    return from;
  }
  return '/articles';
}

interface AuthFormProps {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
}

function AuthForm({ isOpen, mode, onClose }: Readonly<AuthFormProps>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState<Credentials>({ name: '', password: '' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const { isSuccess: isServerAlive, isError: isServerUnavailable, isFetching: isCheckingServer } = useHealth();
  const isRegister = mode === 'register';
  const activeMutation = isRegister ? registerMutation : loginMutation;
  const title = isRegister ? 'Register' : 'Login';
  const inputClassName =
    'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400';
  const isDisabled = activeMutation.isPending || !isServerAlive;
  const submitLabel = !isServerAlive ? (isCheckingServer ? 'Checking server...' : 'Server unavailable') : title;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    activeMutation.mutate(credentials, {
      onSuccess: () => {
        onClose();
        navigate(postLoginPath(location.state), { replace: true });
      },
    });
  }

  return (
    <PopupWrapper popup={isOpen} setPopup={(value) => !value && onClose()} status="neutral">
      <form className="article-form mx-auto flex w-80 max-w-full flex-col space-y-6" onSubmit={handleSubmit}>
        <h1 className="text-center text-3xl font-bold dark:text-white">{title}</h1>
        <div className="flex flex-col space-y-3 text-slate-800 dark:text-slate-100">
          <div>
            <label htmlFor="auth-name" className="text-slate-800 dark:text-slate-100">
              <b>Name</b>
            </label>
            <Input
              id="auth-name"
              type="text"
              name="name"
              placeholder="Name"
              value={credentials.name}
              onChange={(event) => setCredentials((prev) => ({ ...prev, name: event.target.value }))}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="text-slate-800 dark:text-slate-100">
              <b>Password</b>
            </label>
            <div className="relative">
              <Input
                id="auth-password"
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                className={`${inputClassName} pr-10`}
                required
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                aria-pressed={isPasswordVisible}
              >
                {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
        {isCheckingServer && (
          <div
            className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/60 dark:bg-amber-950/40 dark:text-amber-100"
            role="alert"
          >
            <span>The server is currently waking up, it can take up to 1mn to be fully available.</span>
          </div>
        )}
        {isServerUnavailable && (
          <div
            className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/60 dark:bg-amber-950/40 dark:text-amber-100"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 shrink-0" size={16} />
            <span>The server is not responding right now. Please try again in a moment.</span>
          </div>
        )}
        <div className="flex w-full justify-center">
          <button className={`${buttonStyle.success} ${buttonSize.medium}`} type="submit" disabled={isDisabled}>
            {activeMutation.isPending ? 'Please wait...' : submitLabel}
          </button>
        </div>
      </form>
    </PopupWrapper>
  );
}

export default AuthForm;
