/**
 * Footer.jsx
 * Shared footer used across all pages.
 */
export default function Footer() {
  return (
    <footer className="text-center py-8 text-xs text-slate-600">
      <p>
        Made with{' '}
        <span className="text-red-500 animate-pulse inline-block">♥</span>
        {' '}by{' '}
        <span className="text-slate-400 font-semibold">Aashish Rajput</span>
      </p>
      <p className="mt-1">
        Dataset:{' '}
        <a
          href="https://archive.ics.uci.edu/dataset/320/student+performance"
          target="_blank"
          rel="noreferrer"
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          UCI Student Performance (ID=320) by Paulo Cortez
        </a>
      </p>
    </footer>
  );
}
