function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/70 py-4 text-center text-xs text-slate-500 transition-colors dark:border-slate-700/70 dark:text-slate-400">
      &copy; {new Date().getFullYear()} Devan Prigent
    </footer>
  );
}

export default Footer;
