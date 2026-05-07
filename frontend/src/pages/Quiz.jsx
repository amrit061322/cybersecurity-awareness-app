import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import api from '../services/api';
import { learnTopics } from '../data/learnTopics';

const quizList = [
  { key: 'phishing', title: 'Phishing Awareness', description: 'Spot malicious emails and fake links.' },
  { key: 'password-safety', title: 'Password Safety', description: 'Build strong, resilient credentials.' },
  { key: 'malware-awareness', title: 'Malware Awareness', description: 'Identify and prevent malware threats.' },
  { key: 'online-privacy', title: 'Online Privacy', description: 'Protect data on public networks.' }
];

const Quiz = () => {
  const { topic } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [status, setStatus] = useState('idle');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const LOW_SCORE_THRESHOLD = 70;

  const selectedQuiz = useMemo(() => quizList.find((item) => item.key === topic), [topic]);
  const recommendedLesson = useMemo(
    () => learnTopics.find((lesson) => lesson.quizTopic === topic || lesson.slug === topic),
    [topic]
  );

  useEffect(() => {
    if (!topic) return;
    const fetchQuiz = async () => {
      setStatus('loading');
      try {
        const response = await api.get(`/quiz/${topic}`);
        setQuiz(response.data);
        setAnswers(new Array(response.data.questions.length).fill(null));
        setTimeLeft(response.data.questions.length * 20);
        setStatus('ready');
      } catch (error) {
        setStatus('error');
      }
    };
    fetchQuiz();
  }, [topic]);

  useEffect(() => {
    if (status !== 'ready' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && status === 'ready') {
      handleSubmit();
    }
  }, [timeLeft, status]);

  const handleSelect = (index) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[current] = index;
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      setStatus('submitting');
      const response = await api.post('/quiz/submit', { topic, answers });
      setResult(response.data);
      setStatus('done');
    } catch (error) {
      setStatus('error');
    }
  };

  if (!topic) {
    return (
      <div
        className="max-w-6xl mx-auto px-4 py-10 page-bg"
        style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?cybersecurity,quiz')" }}
      >
        <div className="glass-panel p-6">
          <h1 className="section-title">Choose a Quiz</h1>
          <p className="text-on-surface-variant mt-3">Start with one of the real-time awareness quizzes.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {quizList.map((item) => (
            <div key={item.key} className="glass-panel p-6 card-hover">
              <h2 className="font-headline text-on-surface text-xl">{item.title}</h2>
              <p className="text-on-surface-variant mt-2">{item.description}</p>
              <Link to={`/quiz/${item.key}`} className="cyber-button mt-4 inline-flex">Start Quiz</Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-10 space-y-6 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?cybersecurity,quiz')" }}
    >
      <div className="glass-panel p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl text-on-surface">{selectedQuiz?.title || 'Quiz Session'}</h1>
          <p className="text-on-surface-variant text-sm">Answer quickly and keep an eye on the timer.</p>
        </div>
        <div className="text-primary-container font-semibold">Time left: {timeLeft}s</div>
      </div>

      {status === 'loading' && <p className="text-on-surface-variant">Loading quiz...</p>}
      {status === 'error' && <p className="text-red-400">Unable to load quiz.</p>}

      {status === 'ready' && quiz && (
        <div className="space-y-4">
          <div className="text-on-surface-variant">Question {current + 1} of {quiz.questions.length}</div>
          <QuizCard
            question={quiz.questions[current].question}
            options={quiz.questions[current].options}
            selected={answers[current]}
            onSelect={handleSelect}
          />
          <div className="flex flex-wrap gap-3">
            <button
              className="px-4 py-2 rounded-xl border border-outline-variant/30 text-on-surface-variant disabled:opacity-40"
              onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
              disabled={current === 0}
            >
              Previous
            </button>
            {current < quiz.questions.length - 1 ? (
              <button
                className="cyber-button"
                onClick={() => setCurrent((prev) => Math.min(prev + 1, quiz.questions.length - 1))}
              >
                Next
              </button>
            ) : (
              <button className="cyber-button" onClick={handleSubmit}>
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {status === 'done' && result && (
        <div className="glass-panel p-6 space-y-3">
          <h2 className="font-headline text-2xl text-on-surface">Quiz Results</h2>
          <p className="text-on-surface-variant">Score: {result.result.score} / {quiz.questions.length}</p>
          <p className="text-on-surface-variant">Percentage: {result.result.percentage}%</p>
          <p className="text-primary-container">Awareness Level: {result.awareness_level}</p>
          {result.result.percentage < LOW_SCORE_THRESHOLD && recommendedLesson && (
            <div className="mt-4 rounded-xl border border-primary-container/20 bg-surface-container-low/60 p-4 space-y-3">
              <div>
                <p className="font-label text-[10px] uppercase tracking-widest text-primary-fixed-dim">
                  Recommended Lesson
                </p>
                <h3 className="font-headline text-lg text-on-surface">{recommendedLesson.title}</h3>
                <p className="text-on-surface-variant text-sm">{recommendedLesson.description}</p>
              </div>
              <ul className="list-disc list-inside text-on-surface-variant text-sm space-y-1">
                {recommendedLesson.tips.slice(0, 3).map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
              <Link to="/learn" className="cyber-button">Review Lesson</Link>
            </div>
          )}
          <Link to="/profile" className="cyber-button">View Profile</Link>
        </div>
      )}
    </div>
  );
};

export default Quiz;
