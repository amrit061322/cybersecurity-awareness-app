import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { learnTopics } from '../data/learnTopics';
import api from '../services/api';

const Learn = () => {
  const [topics, setTopics] = useState(learnTopics);
  const [loading, setLoading] = useState(true);
  const totalTopics = topics.length;
  const totalTips = topics.reduce((sum, topic) => sum + (topic.tips?.length || 0), 0);
  const quizCount = topics.filter((topic) => topic.quizTopic).length;
  const topicImages = {
    phishing: 'https://source.unsplash.com/800x600/?phishing,email',
    'password-security': 'https://source.unsplash.com/800x600/?password,security',
    'social-engineering': 'https://source.unsplash.com/800x600/?social,engineering,security',
    malware: 'https://source.unsplash.com/800x600/?malware,code',
    ransomware: 'https://source.unsplash.com/800x600/?ransomware,cyber',
    'public-wifi': 'https://source.unsplash.com/800x600/?wifi,security',
    'data-privacy': 'https://source.unsplash.com/800x600/?privacy,lock',
    'email-scams': 'https://source.unsplash.com/800x600/?email,security',
    'identity-theft': 'https://source.unsplash.com/800x600/?identity,security',
    'two-factor-authentication': 'https://source.unsplash.com/800x600/?mfa,security'
  };
  const fallbackImage = 'https://source.unsplash.com/800x600/?cybersecurity,network';
  const getTopicImage = (slug) => topicImages[slug] || fallbackImage;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');
        if (response.data?.resources?.length) {
          setTopics(response.data.resources);
        }
      } catch (error) {
        // fallback to static topics
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div
      className="pt-24 pb-32 px-4 max-w-5xl mx-auto space-y-8 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?cybersecurity,training')" }}
    >
      <section className="relative overflow-hidden glass-card rounded-xl p-8 border border-outline-variant/20">
        <div className="scanner-line opacity-30"></div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-primary-container"></div>
              <span className="font-label text-xs uppercase tracking-widest text-primary-fixed-dim">
                System Intelligence Overview
              </span>
            </div>
            <h1 className="font-headline text-4xl font-bold text-on-surface tracking-tight mb-2">
              Cyber Security Learning Hub
            </h1>
            <p className="text-on-surface-variant max-w-xl">
              Explore key awareness topics, practical tips, and trusted resources to strengthen your cyber hygiene.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-high border border-outline-variant/30 p-4 rounded-xl text-center min-w-[120px]">
              <div className="text-primary-fixed-dim font-headline text-2xl font-bold">{quizCount}/{totalTopics}</div>
              <div className="text-[10px] font-label uppercase text-slate-500">Quizzes Available</div>
            </div>
            <div className="bg-surface-container-high border border-outline-variant/30 p-4 rounded-xl text-center min-w-[120px]">
              <div className="text-secondary font-headline text-2xl font-bold">{totalTips}</div>
              <div className="text-[10px] font-label uppercase text-slate-500">Actionable Tips</div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        <button className="px-6 py-2 rounded-full font-label text-xs tracking-widest uppercase bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(0,240,255,0.3)]">
          All Protocols
        </button>
        {topics.slice(0, 5).map((topic) => (
          <button
            key={topic.slug}
            className="px-6 py-2 rounded-full font-label text-xs tracking-widest uppercase border border-outline-variant/30 text-on-surface hover:border-primary-container transition-all whitespace-nowrap"
          >
            {topic.title}
          </button>
        ))}
      </div>

      {loading && <p className="text-on-surface-variant">Loading resources...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic, index) => {
          const progress = Math.min(100, Math.round(((topic.tips?.length || 0) / 5) * 100));
          const hasQuiz = Boolean(topic.quizTopic);
          return (
            <div
              key={topic.slug}
              className="glass-card group relative flex flex-col rounded-xl border border-outline-variant/10 hover:border-cyan-500/40 transition-all duration-500 overflow-hidden"
            >
              <div
                className="h-40 relative overflow-hidden bg-surface-container-lowest bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(13,20,29,0.8), rgba(13,20,29,0.8)), url(${getTopicImage(topic.slug)})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded text-[10px] font-label uppercase tracking-tighter border ${
                    hasQuiz
                      ? 'bg-surface-container-highest/80 text-tertiary-fixed-dim border-tertiary-fixed-dim/20'
                      : 'bg-secondary-container/80 text-white border-white/20'
                  }`}>
                    {hasQuiz ? 'Operational' : 'Authorized'}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-cyan-500/20 text-7xl">shield</span>
                </div>
              </div>
                <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-headline text-xl font-bold text-on-surface mb-1 group-hover:text-cyan-400 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs font-label uppercase text-slate-500 tracking-wider">
                      {topic.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-lg">signal_cellular_alt</span>
                    <span className="text-[10px] font-label text-secondary uppercase">Level {index + 1}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full shadow-[0_0_10px_#00f0ff]" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-label text-tertiary-fixed-dim uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      {hasQuiz ? 'Quiz Ready' : 'Tips Only'}
                    </span>
                    {hasQuiz ? (
                      <Link
                        to={`/quiz/${topic.quizTopic}`}
                        className="px-4 py-1.5 rounded bg-white/10 hover:bg-primary-container hover:text-on-primary-container transition-all text-[10px] font-label text-white uppercase tracking-widest border border-white/10"
                      >
                        Take Quiz
                      </Link>
                    ) : (
                      <button className="text-xs font-label text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                        Review Tips <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <details className="border-t border-outline-variant/10 p-5 text-sm text-on-surface-variant">
                <summary className="cursor-pointer font-label text-[10px] uppercase tracking-widest text-primary-container">
                  View Tips & Resources
                </summary>
                <div className="mt-4 space-y-4">
                  <ul className="space-y-2 list-disc list-inside">
                    {topic.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3 text-xs uppercase font-label tracking-widest">
                    {topic.resources.map((resource) => (
                      <a
                        key={resource.url}
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-container hover:text-primary"
                      >
                        {resource.label}
                      </a>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Learn;
