import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'text-white glow-text' : ''}`;

  return (
    <header className="sticky top-0 z-50 bg-base-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <NavLink to="/" className="font-display text-lg tracking-widest text-white glow-text">
          CyberAware
        </NavLink>
        <button
          className="md:hidden text-slate-200"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/learn" className={navLinkClass}>Learn</NavLink>
          <NavLink to="/quiz" className={navLinkClass}>Quiz</NavLink>
          {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
          {user && <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
          {!user && <NavLink to="/login" className={navLinkClass}>Login</NavLink>}
          {user && (
            <button onClick={logout} className="nav-link">Logout</button>
          )}
        </nav>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-base-900/95 px-4 py-4 space-y-3">
          <NavLink to="/" className={navLinkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/learn" className={navLinkClass} onClick={() => setOpen(false)}>Learn</NavLink>
          <NavLink to="/quiz" className={navLinkClass} onClick={() => setOpen(false)}>Quiz</NavLink>
          {user && <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>}
          {user && <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>Profile</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>Admin</NavLink>}
          {!user && <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>Login</NavLink>}
          {user && (
            <button onClick={() => { logout(); setOpen(false); }} className="nav-link">Logout</button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
