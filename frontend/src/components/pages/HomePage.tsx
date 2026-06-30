import { useState } from 'react';

import { AuthMode } from '../../constants/types';
import ScreenshotCarousel from '../features/ScreenshotCarousel';
import AuthForm from '../forms/AuthForm';

function HomePage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  function openAuthForm(mode: AuthMode) {
    setAuthMode(mode);
    setIsAuthFormOpen(true);
  }

  return (
    <>
      <div className="space-y-10 py-4 sm:py-8">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Never forget an article you've liked again.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Save articles, track what you read, add notes, and get simple insights into your reading habits. For free.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  data-testid="register-btn"
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-emerald-500/80 bg-emerald-500 px-6 text-base font-bold tracking-wide text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-300/60 dark:border-emerald-400 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
                  onClick={() => openAuthForm('register')}
                >
                  Register
                </button>
                <button
                  data-testid="login-btn"
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white/80 px-6 text-base font-bold tracking-wide text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-300/60 dark:border-slate-500 dark:bg-slate-800/80 dark:text-white dark:hover:bg-slate-700"
                  onClick={() => openAuthForm('login')}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
          <ScreenshotCarousel />
        </section>
      </div>
      <AuthForm isOpen={isAuthFormOpen} mode={authMode} onClose={() => setIsAuthFormOpen(false)} />
    </>
  );
}

export default HomePage;
