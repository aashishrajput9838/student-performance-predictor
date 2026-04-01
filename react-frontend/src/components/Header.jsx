/**
 * Header.jsx
 * Sticky glassmorphic navigation bar with React Router links.
 * Active route is highlighted automatically via NavLink.
 */
import { NavLink, Link } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/predictor', label: 'Predictor' },
  { to: '/workflow',  label: 'How it Works' },
  { to: '/about',     label: 'Database' },
];

export default function Header() {
  return (
    <header className="glass sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="font-display text-lg font-extrabold text-gradient tracking-widest uppercase hover:opacity-80 transition-opacity">
          Student Performance Predictor
        </Link>

        {/* Nav Links */}
        <nav className="flex gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* CTA Button */}
          <Link
            to="/predictor"
            className="ml-3 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary shadow-primary/30 shadow-md hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Try Now →
          </Link>
        </nav>
      </div>
    </header>
  );
}
