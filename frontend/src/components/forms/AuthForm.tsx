import { useState, type FormEvent } from 'react';
import { Input } from 'reactstrap';
import { buttonSize, buttonStyle } from '../../constants/constants';
import type { Credentials } from '../../constants/types';
import { useLogin, useRegister } from '../../hooks/mutations';
import PopupWrapper from '../features/PopupWrapper';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
}

function AuthForm({ isOpen, mode, onClose }: Readonly<AuthFormProps>) {
  const [credentials, setCredentials] = useState<Credentials>({ name: '', password: '' });
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const isRegister = mode === 'register';
  const activeMutation = isRegister ? registerMutation : loginMutation;
  const title = isRegister ? 'Register' : 'Login';
  const submitLabel = activeMutation.isPending ? 'Please wait...' : title;
  const inputClassName =
    'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    activeMutation.mutate(credentials, { onSuccess: onClose });
  }

  return (
    <PopupWrapper popup={isOpen} setPopup={(value) => !value && onClose()} status="neutral">
      <form className="article-form flex w-80 flex-col space-y-6" onSubmit={handleSubmit}>
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
            <Input
              id="auth-password"
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
              className={inputClassName}
              required
            />
          </div>
        </div>
        <div className="flex w-full justify-center">
          <button className={`${buttonStyle.success} ${buttonSize.medium}`} type="submit" disabled={activeMutation.isPending}>
            {submitLabel}
          </button>
        </div>
      </form>
    </PopupWrapper>
  );
}

export default AuthForm;
