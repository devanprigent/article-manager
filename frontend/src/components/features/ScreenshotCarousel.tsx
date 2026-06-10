import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

import { AnimatePresence, motion } from 'framer-motion';

import { useTheme } from '../../contexts/ThemeContext';

const getScreenshots = (theme: string) => {
  return [
    {
      src: `/screenshots/${theme}/articles.PNG`,
      title: 'Collect your reading list',
      description: 'Keep every useful article, blog post, and website in one organized place.',
    },
    {
      src: `/screenshots/${theme}/likes.PNG`,
      title: 'Find liked articles quickly',
      description: 'Mark articles you like.',
    },
    {
      src: `/screenshots/${theme}/read-later.PNG`,
      title: 'Save articles to read again',
      description: 'Mark articles you want to read later.',
    },
    {
      src: `/screenshots/${theme}/stats.PNG`,
      title: 'Review your habits',
      description: 'Track what you read and understand your reading habits.',
    },
  ];
};

function ScreenshotCarousel() {
  const theme = useTheme().theme;
  const isDarkTheme = theme === 'dark';
  const screenshots = getScreenshots(theme);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const currentScreenshot = screenshots[currentScreenshotIndex];

  const carouselArrowBtnClass = isDarkTheme
    ? 'rounded-full border border-slate-500/90 bg-slate-700 p-2 shadow-md shadow-black/30 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-slate-600'
    : 'rounded-full border border-slate-300/80 bg-slate-100/90 p-2 shadow-sm shadow-slate-300/40 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white';
  const carouselChevronColor = isDarkTheme ? '#f8fafc' : '#0f172a';

  const showPreviousScreenshot = () => {
    setCurrentScreenshotIndex((currentIndex) => (currentIndex - 1 + screenshots.length) % screenshots.length);
  };

  const showNextScreenshot = () => {
    setCurrentScreenshotIndex((currentIndex) => (currentIndex + 1) % screenshots.length);
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-300/80 bg-gradient-to-br from-slate-100/95 via-indigo-50/80 to-slate-200/90 p-3 shadow-2xl shadow-slate-400/25 backdrop-blur dark:border-slate-700/70 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-900/90 dark:shadow-slate-950/30">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-400/20" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-400/20" />

      <div className="relative h-[220px] w-full overflow-hidden rounded-[1.5rem] bg-slate-200/80 p-1 shadow-inner shadow-slate-400/20 dark:bg-slate-950/40 dark:shadow-black/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreenshot.title}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-1 overflow-hidden rounded-[1.25rem] bg-slate-50 shadow-xl shadow-slate-500/20 ring-1 ring-slate-900/15 dark:bg-slate-900 dark:shadow-black/40 dark:ring-white/10"
          >
            <img src={currentScreenshot.src} alt={`${currentScreenshot.title} screenshot`} className="h-full w-full object-cover object-top" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative mt-4 flex items-start justify-between gap-4 px-1">
        <div className="min-h-[7rem] flex-1 pr-2 sm:min-h-[6rem]">
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{currentScreenshot.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{currentScreenshot.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" aria-label="Show previous screenshot" onClick={showPreviousScreenshot} className={carouselArrowBtnClass}>
            <ChevronLeft size={20} strokeWidth={2.5} color={carouselChevronColor} aria-hidden />
          </button>
          <button type="button" aria-label="Show next screenshot" onClick={showNextScreenshot} className={carouselArrowBtnClass}>
            <ChevronRight size={20} strokeWidth={2.5} color={carouselChevronColor} aria-hidden />
          </button>
        </div>
      </div>

      <div className="relative mt-4 flex justify-center gap-2">
        {screenshots.map((screenshot, index) => (
          <button
            key={screenshot.title}
            type="button"
            aria-label={`Show ${screenshot.title} screenshot`}
            onClick={() => setCurrentScreenshotIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === currentScreenshotIndex
                ? 'w-8 bg-indigo-600 shadow-sm shadow-indigo-500/30 dark:bg-indigo-400'
                : isDarkTheme
                  ? 'w-2.5 bg-slate-500 hover:bg-slate-400'
                  : 'w-2.5 bg-slate-400 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ScreenshotCarousel;
