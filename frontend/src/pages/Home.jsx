import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const cards = [
    {
      title: 'Learning Hub',
      copy: 'Curated resources from trusted cyber security agencies with actionable tips.',
      to: '/learn',
      adminOnly: false
    },
    {
      title: 'Awareness Tracking',
      copy: 'See your progress, latest scores, and awareness level in one dashboard.',
      to: '/profile',
      adminOnly: false
    },
    {
      title: 'Admin Analytics',
      copy: 'Monitor platform usage, identify weak areas, and improve training.',
      to: '/admin',
      adminOnly: true
    }
  ];

  return (
    <div
      className="space-y-16 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?cybersecurity,network')" }}
    >
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-container/10 via-transparent to-transparent"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-primary-container text-xs">CyberAware Platform</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mt-4">
              Build cyber resilience with guided learning and real-time quizzes.
            </h1>
            <p className="mt-4 text-on-surface-variant">
              Learn how to spot phishing, secure your accounts, and protect sensitive data. Track your awareness level and
              improve with every quiz.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/learn" className="cyber-button">Start Learning</Link>
              <Link to="/quiz" className="px-5 py-2.5 rounded-xl border border-primary-container/30 text-primary-container hover:bg-primary-container/10">
                Take a Quiz
              </Link>
            </div>
          </div>
          <div className="glass-panel p-6 relative overflow-hidden">
            <div className="scanner-line opacity-30"></div>
            <h3 className="font-headline text-on-surface text-xl mb-4">CyberAware Snapshot</h3>
            <div className="grid gap-4">
              {[
                { label: 'Interactive Quizzes', value: 'Real-time scoring', to: '/quiz', adminOnly: false },
                { label: 'Awareness Levels', value: 'Vulnerable -> Cyber Smart', to: '/profile', adminOnly: false },
                { label: 'Admin Insights', value: 'Track progress at scale', to: '/admin', adminOnly: true }
              ]
                .filter((item) => !item.adminOnly || user?.role === 'admin')
                .map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center justify-between bg-surface-container-low/70 rounded-xl p-4 border border-outline-variant/20 hover:border-primary-container transition-all"
                  >
                    <div>
                      <p className="text-on-surface font-semibold">{item.label}</p>
                      <p className="text-on-surface-variant text-sm">{item.value}</p>
                    </div>
                    <span className="text-primary-container">*</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="scanner-line opacity-20"></div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-label text-xs uppercase tracking-widest text-primary-fixed-dim">Mission Control</p>
              <h2 className="font-headline text-2xl text-on-surface mt-2">Choose Your Next Protocol</h2>
              <p className="text-on-surface-variant mt-2 max-w-2xl">
                Earn status upgrades by completing focused drills. Become a Phishing Pro, lock down your credentials,
                and verify suspicious links with confidence.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/quiz" className="cyber-button">Start Drill</Link>
              <Link to="/learn" className="px-5 py-2.5 rounded-xl border border-primary-container/30 text-primary-container hover:bg-primary-container/10">
                Browse Intel
              </Link>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-surface-container-low/60 rounded-xl p-4 border border-outline-variant/20">
              <p className="font-label text-[10px] uppercase tracking-widest text-outline">Rank Up</p>
              <h3 className="font-headline text-lg text-on-surface mt-2">Become a Phishing Pro</h3>
              <p className="text-on-surface-variant text-sm mt-2">
                Complete the phishing module and ace the quiz to unlock your next badge.
              </p>
              <Link to="/learn" className="text-primary-container text-sm mt-3 inline-flex">Open Module</Link>
            </div>
            <div className="bg-surface-container-low/60 rounded-xl p-4 border border-outline-variant/20">
              <p className="font-label text-[10px] uppercase tracking-widest text-outline">Quick Win</p>
              <h3 className="font-headline text-lg text-on-surface mt-2">Password Shield</h3>
              <p className="text-on-surface-variant text-sm mt-2">
                Harden your credentials and check your readiness in under 5 minutes.
              </p>
              <Link to="/quiz/password-safety" className="text-primary-container text-sm mt-3 inline-flex">Take Quiz</Link>
            </div>
            <div className="bg-surface-container-low/60 rounded-xl p-4 border border-outline-variant/20">
              <p className="font-label text-[10px] uppercase tracking-widest text-outline">Field Check</p>
              <h3 className="font-headline text-lg text-on-surface mt-2">Scan for Phishing</h3>
              <p className="text-on-surface-variant text-sm mt-2">
                Drop a link into the detector to validate it before you click.
              </p>
              <Link to="/detect-phishing" className="text-primary-container text-sm mt-3 inline-flex">Run Scan</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {cards
            .filter((card) => !card.adminOnly || user?.role === 'admin')
            .map((card) => (
              <Link key={card.title} to={card.to} className="glass-panel p-6 card-hover block">
                <h3 className="font-headline text-on-surface text-xl mb-2">{card.title}</h3>
                <p className="text-on-surface-variant text-sm">{card.copy}</p>
              </Link>
            ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel p-6">
            <h3 className="font-headline text-on-surface text-lg">Community Intel</h3>
            <p className="text-on-surface-variant text-sm mt-2">
              Learn from real-world stories shared by other learners.
            </p>
            <Link to="/community" className="text-primary-container text-sm mt-4 inline-flex">View Feed</Link>
          </div>
          <div className="glass-panel p-6">
            <h3 className="font-headline text-on-surface text-lg">Track Your Progress</h3>
            <p className="text-on-surface-variant text-sm mt-2">
              See your current awareness level and recommended next steps.
            </p>
            <Link to="/profile" className="text-primary-container text-sm mt-4 inline-flex">Open Profile</Link>
          </div>
          <div className="glass-panel p-6">
            <h3 className="font-headline text-on-surface text-lg">Send Feedback</h3>
            <p className="text-on-surface-variant text-sm mt-2">
              Suggest improvements or request a new learning module.
            </p>
            <Link to="/feedback" className="text-primary-container text-sm mt-4 inline-flex">Share Feedback</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
