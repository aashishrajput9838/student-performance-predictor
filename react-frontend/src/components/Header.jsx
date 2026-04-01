/**
 * Header.jsx
 * Top navigation bar with logo and a subtle glassmorphic background.
 */
export default function Header() {
  return (
    <header className="glass sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <span className="font-display text-2xl font-extrabold text-gradient">
          EduAI.
        </span>

        {/* Nav Links */}
        <nav className="flex gap-6 text-sm text-slate-400">
          <a href="#predictor" className="hover:text-white transition-colors duration-200">Predictor</a>
          <a href="#about" className="hover:text-white transition-colors duration-200">About</a>
        </nav>
      </div>
    </header>
  );
}
