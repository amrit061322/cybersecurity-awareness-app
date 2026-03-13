const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-base-900/80">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-6 text-sm text-slate-300">
        <div>
          <h3 className="font-display text-white mb-2">About Platform</h3>
          <p>
            CyberAware helps learners build practical cyber safety skills through guided content and real-time quizzes.
          </p>
        </div>
        <div>
          <h3 className="font-display text-white mb-2">Contact</h3>
          <p>Email: support@cyberaware.com</p>
          <p>LinkedIn: CyberAware</p>
        </div>
        <div>
          <h3 className="font-display text-white mb-2">Privacy Policy</h3>
          <p>We respect your data and store only what is required to improve awareness.</p>
        </div>
        <div>
          <h3 className="font-display text-white mb-2">GitHub</h3>
          <a
            className="text-cyber-300 hover:text-white"
            href="https://github.com/amrit061322/cybersecurity-awareness-app"
            target="_blank"
            rel="noreferrer"
          >
            View Repository
          </a>
          <div className="mt-3">
            <h4 className="font-display text-white mb-1">Cyber Security Tips</h4>
            <p>Update software, use MFA, and verify links before clicking.</p>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-6">© 2026 CyberAware Platform</div>
    </footer>
  );
};

export default Footer;
