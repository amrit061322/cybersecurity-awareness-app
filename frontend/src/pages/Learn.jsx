import { Link } from 'react-router-dom';
import CyberTip from '../components/CyberTip';
import { learnTopics } from '../data/learnTopics';

const Learn = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="section-title">Cyber Security Learning Hub</h1>
        <p className="text-slate-300 mt-3 max-w-2xl">
          Explore key awareness topics, practical tips, and trusted resources to strengthen your cyber hygiene.
        </p>
      </div>

      <div className="grid gap-6">
        {learnTopics.map((topic) => (
          <div key={topic.slug} className="glass-panel p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-white">{topic.title}</h2>
                <p className="text-slate-300 mt-2">{topic.description}</p>
              </div>
              {topic.quizTopic && (
                <Link to={`/quiz/${topic.quizTopic}`} className="cyber-button">
                  Take Quiz
                </Link>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {topic.tips.map((tip) => (
                <CyberTip key={tip} tip={tip} />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {topic.resources.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyber-300 hover:text-white"
                >
                  {resource.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
