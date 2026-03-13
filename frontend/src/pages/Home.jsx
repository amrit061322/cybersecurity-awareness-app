import { Link } from 'react-router-dom';
import FeedbackForm from '../components/FeedbackForm';

const Home = () => {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-cyber-300 text-xs">CyberAware Platform</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-4">
              Build cyber resilience with guided learning and real-time quizzes.
            </h1>
            <p className="mt-4 text-slate-300">
              Learn how to spot phishing, secure your accounts, and protect sensitive data. Track your awareness level and
              improve with every quiz.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/learn" className="cyber-button">Start Learning</Link>
              <Link to="/quiz" className="px-5 py-2.5 rounded-xl border border-white/20 text-white hover:border-cyber-400">
                Take a Quiz
              </Link>
            </div>
          </div>
          <div className="glass-panel p-6">
            <h3 className="font-display text-white text-xl mb-4">CyberAware Snapshot</h3>
            <div className="grid gap-4">
              {[
                { label: 'Interactive Quizzes', value: 'Real-time scoring' },
                { label: 'Awareness Levels', value: 'Vulnerable ? Cyber Smart' },
                { label: 'Admin Insights', value: 'Track progress at scale' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-base-800/70 rounded-xl p-4">
                  <div>
                    <p className="text-white font-semibold">{item.label}</p>
                    <p className="text-slate-400 text-sm">{item.value}</p>
                  </div>
                  <span className="text-cyber-300">?</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Learning Hub',
              copy: 'Curated resources from trusted cyber security agencies with actionable tips.'
            },
            {
              title: 'Awareness Tracking',
              copy: 'See your progress, latest scores, and awareness level in one dashboard.'
            },
            {
              title: 'Admin Analytics',
              copy: 'Monitor platform usage, identify weak areas, and improve training.'
            }
          ].map((card) => (
            <div key={card.title} className="glass-panel p-6 card-hover">
              <h3 className="font-display text-white text-xl mb-2">{card.title}</h3>
              <p className="text-slate-300 text-sm">{card.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <FeedbackForm />
      </section>
    </div>
  );
};

export default Home;
