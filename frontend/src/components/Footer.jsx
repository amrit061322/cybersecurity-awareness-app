import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-primary-container/15 bg-[#0d141d]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-6 text-sm text-slate-300">
        <div>
          <h3 className="font-headline text-on-surface mb-2 tracking-widest uppercase text-xs">About Platform</h3>
          <p>
            CyberAware helps learners build practical cyber safety skills through guided content and real-time quizzes.
          </p>
          <div className="mt-2 flex flex-col items-start gap-2">
            <Link className="text-primary-container hover:text-primary text-sm" to="/about">
              Learn more
            </Link>
            <Link className="text-primary-container hover:text-primary text-sm" to="/feedback">
              Share feedback
            </Link>
          </div>
        </div>
        <div>
          <h3 className="font-headline text-on-surface mb-2 tracking-widest uppercase text-xs">Contact</h3>
          <a href="mailto:amritwaiba73@gmail.com"><p>Email: amritwaiba73@gmail.com</p></a>
          <p>LinkedIn: Amrit Tamang</p>
        </div>
        <div>
          <h3 className="font-headline text-on-surface mb-2 tracking-widest uppercase text-xs">Privacy Policy</h3>
          <p>We respect your data and store only what is required to improve awareness.</p>
        </div>
        <div>
          <h3 className="font-headline text-on-surface mb-2 tracking-widest uppercase text-xs">GitHub</h3>
          <a
            className="text-primary-container hover:text-primary"
            href="https://github.com/amrit061322/cybersecurity-awareness-app"
            target="_blank"
            rel="noreferrer"
          >
            View Repository
          </a>
          <div className="mt-3">
            <h4 className="font-headline text-on-surface mb-1 text-xs tracking-widest uppercase">Cyber Security Tips</h4>
            <p>Update software, use MFA, and verify links before clicking.</p>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-6"> ©️ 2026 CyberAware Platform</div>
    </footer>
  );
};

export default Footer;

