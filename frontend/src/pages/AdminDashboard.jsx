import { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const emptyResourceForm = {
  id: null,
  title: '',
  description: '',
  quizTopic: '',
  tips: [''],
  resources: [{ label: '', url: '' }]
};

const emptyQuizForm = {
  id: null,
  topic: '',
  questions: [
    {
      question: '',
      options: ['', ''],
      correctAnswer: '',
      explanation: ''
    }
  ]
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [resourceForm, setResourceForm] = useState(emptyResourceForm);
  const [quizForm, setQuizForm] = useState(emptyQuizForm);
  const [resourceSearch, setResourceSearch] = useState('');
  const [quizSearch, setQuizSearch] = useState('');
  const [formStatus, setFormStatus] = useState({ resource: 'idle', quiz: 'idle' });

  const fetchAdminData = async () => {
    const [statsResponse, feedbackResponse, resourcesResponse, quizzesResponse] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/feedback'),
      api.get('/admin/resources'),
      api.get('/admin/quizzes')
    ]);
    setStats(statsResponse.data);
    setFeedback(feedbackResponse.data.feedback || []);
    setResources(resourcesResponse.data.resources || []);
    setQuizzes(quizzesResponse.data.quizzes || []);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const filteredResources = useMemo(() => {
    const term = resourceSearch.trim().toLowerCase();
    if (!term) return resources;
    return resources.filter((item) =>
      [item.title, item.slug, item.description].some((value) =>
        String(value || '').toLowerCase().includes(term)
      )
    );
  }, [resources, resourceSearch]);

  const filteredQuizzes = useMemo(() => {
    const term = quizSearch.trim().toLowerCase();
    if (!term) return quizzes;
    return quizzes.filter((item) => String(item.topic || '').toLowerCase().includes(term));
  }, [quizzes, quizSearch]);

  if (!stats) {
    return <p className="text-on-surface-variant px-4 py-10">Loading admin analytics...</p>;
  }

  const bandLabels = stats.scoreBands.map((band) => (band._id === 'unknown' ? 'Unknown' : `${band._id}+`));
  const bandCounts = stats.scoreBands.map((band) => band.count);

  const chartData = {
    labels: bandLabels,
    datasets: [
      {
        label: 'Users per Score Band',
        data: bandCounts,
        backgroundColor: 'rgba(0, 240, 255, 0.35)'
      }
    ]
  };

  const handleResourceSubmit = async () => {
    try {
      setFormStatus((prev) => ({ ...prev, resource: 'loading' }));
      const payload = {
        title: resourceForm.title,
        description: resourceForm.description,
        tips: resourceForm.tips.map((tip) => tip.trim()).filter(Boolean),
        resources: resourceForm.resources
          .filter((item) => item.label && item.url)
          .map((item) => ({ label: item.label.trim(), url: item.url.trim() })),
        quizTopic: resourceForm.quizTopic
      };

      if (resourceForm.id) {
        await api.put(`/admin/resources/${resourceForm.id}`, payload);
      } else {
        await api.post('/admin/resources', payload);
      }

      setFormStatus((prev) => ({ ...prev, resource: 'success' }));
      setResourceForm(emptyResourceForm);
      await fetchAdminData();
    } catch (error) {
      setFormStatus((prev) => ({ ...prev, resource: 'error' }));
    }
  };

  const handleQuizSubmit = async () => {
    try {
      setFormStatus((prev) => ({ ...prev, quiz: 'loading' }));
      const payload = {
        topic: quizForm.topic,
        questions: quizForm.questions
          .map((q) => ({
            question: q.question.trim(),
            options: q.options.map((opt) => opt.trim()).filter(Boolean),
            correctAnswer: q.correctAnswer.trim(),
            explanation: q.explanation.trim()
          }))
          .filter((q) => q.question && q.options.length >= 2 && q.correctAnswer)
      };

      if (quizForm.id) {
        await api.put(`/admin/quizzes/${quizForm.id}`, payload);
      } else {
        await api.post('/admin/quizzes', payload);
      }

      setFormStatus((prev) => ({ ...prev, quiz: 'success' }));
      setQuizForm(emptyQuizForm);
      await fetchAdminData();
    } catch (error) {
      setFormStatus((prev) => ({ ...prev, quiz: 'error' }));
    }
  };

  const handleResourceEdit = (resource) => {
    setResourceForm({
      id: resource._id,
      title: resource.title || '',
      description: resource.description || '',
      quizTopic: resource.quizTopic || '',
      tips: resource.tips?.length ? resource.tips : [''],
      resources: resource.resources?.length ? resource.resources : [{ label: '', url: '' }]
    });
  };

  const handleQuizEdit = (quiz) => {
    setQuizForm({
      id: quiz._id,
      topic: quiz.topic || '',
      questions: quiz.questions?.length
        ? quiz.questions.map((q) => ({
            question: q.question || '',
            options: q.options?.length ? q.options : ['', ''],
            correctAnswer: q.correctAnswer || '',
            explanation: q.explanation || ''
          }))
        : emptyQuizForm.questions
    });
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-10 space-y-8 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?dashboard,security')" }}
    >
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <p className="text-on-surface-variant text-sm">Total Users</p>
          <p className="font-headline text-3xl text-on-surface">{stats.totalUsers}</p>
        </div>
        <div className="glass-panel p-6">
          <p className="text-on-surface-variant text-sm">Quiz Attempts</p>
          <p className="font-headline text-3xl text-on-surface">{stats.totalQuizAttempts}</p>
        </div>
        <div className="glass-panel p-6">
          <p className="text-on-surface-variant text-sm">Average Awareness</p>
          <p className="font-headline text-3xl text-on-surface">{stats.averageAwarenessScore}%</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="font-headline text-on-surface text-xl mb-4">Awareness Distribution</h2>
          <Bar data={chartData} />
        </div>
        <div className="glass-panel p-6">
          <h2 className="font-headline text-on-surface text-xl mb-4">Leaderboard</h2>
          <div className="space-y-3">
            {stats.leaderboard.map((user, index) => (
              <div key={user._id} className="flex items-center justify-between bg-surface-container-low/60 rounded-xl p-3">
                <p className="text-on-surface">#{index + 1} {user.name}</p>
                <p className="text-primary-container">{user.average_score}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="font-headline text-on-surface text-xl mb-4">Lowest Scores</h2>
          <div className="space-y-3">
            {stats.lowestScores.map((user) => (
              <div key={user._id} className="flex items-center justify-between bg-surface-container-low/60 rounded-xl p-3">
                <p className="text-on-surface">{user.name}</p>
                <p className="text-error">{user.average_score}%</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel p-6">
          <h2 className="font-headline text-on-surface text-xl mb-4">Top Quiz Results</h2>
          <div className="space-y-3">
            {stats.highestScores.map((entry) => (
              <div key={entry._id} className="flex items-center justify-between bg-surface-container-low/60 rounded-xl p-3">
                <p className="text-on-surface">{entry.topic}</p>
                <p className="text-primary-container">{entry.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h2 className="font-headline text-on-surface text-xl mb-4">User Feedback</h2>
        <div className="space-y-3">
          {feedback.length === 0 && <p className="text-on-surface-variant">No feedback submitted yet.</p>}
          {feedback.map((item) => (
            <div key={item._id} className="bg-surface-container-low/60 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <p className="text-on-surface font-semibold">{item.name}</p>
                <p className="text-primary-container">Rating: {item.rating}</p>
              </div>
              <p className="text-on-surface-variant text-sm mt-2">{item.message}</p>
              <p className="text-on-surface-variant text-xs mt-2">{new Date(item.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-on-surface text-xl">Learning Resources</h2>
            <input
              className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-sm text-on-surface"
              placeholder="Search resources"
              value={resourceSearch}
              onChange={(event) => setResourceSearch(event.target.value)}
            />
          </div>
          <div className="space-y-3 max-h-[260px] overflow-y-auto">
            {filteredResources.map((item) => (
              <div key={item._id} className="bg-surface-container-low/60 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-on-surface font-semibold">{item.title}</p>
                    <p className="text-on-surface-variant text-xs">{item.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-primary-container text-sm"
                      onClick={() => handleResourceEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 text-sm"
                      onClick={async () => {
                        if (!window.confirm('Delete this resource?')) return;
                        await api.delete(`/admin/resources/${item._id}`);
                        fetchAdminData();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredResources.length === 0 && <p className="text-on-surface-variant text-sm">No resources found.</p>}
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-on-surface text-xl">Quizzes</h2>
            <input
              className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-sm text-on-surface"
              placeholder="Search quizzes"
              value={quizSearch}
              onChange={(event) => setQuizSearch(event.target.value)}
            />
          </div>
          <div className="space-y-3 max-h-[260px] overflow-y-auto">
            {filteredQuizzes.map((item) => (
              <div key={item._id} className="bg-surface-container-low/60 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-on-surface font-semibold">{item.topic}</p>
                    <p className="text-on-surface-variant text-xs">Questions: {item.questions.length}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-primary-container text-sm"
                      onClick={() => handleQuizEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 text-sm"
                      onClick={async () => {
                        if (!window.confirm('Delete this quiz?')) return;
                        await api.delete(`/admin/quizzes/${item._id}`);
                        fetchAdminData();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredQuizzes.length === 0 && <p className="text-on-surface-variant text-sm">No quizzes found.</p>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-4">
          <h2 className="font-headline text-on-surface text-xl">{resourceForm.id ? 'Edit Resource' : 'Add Resource'}</h2>
          <input
            className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
            placeholder="Title"
            value={resourceForm.title}
            onChange={(event) => setResourceForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <textarea
            className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 min-h-[90px] text-on-surface"
            placeholder="Description"
            value={resourceForm.description}
            onChange={(event) => setResourceForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <div className="space-y-2">
            <p className="text-on-surface-variant text-sm">Tips</p>
            {resourceForm.tips.map((tip, index) => (
              <div key={`tip-${index}`} className="flex gap-2">
                <input
                  className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 flex-1 text-on-surface"
                  placeholder={`Tip ${index + 1}`}
                  value={tip}
                  onChange={(event) => {
                    const value = event.target.value;
                    setResourceForm((prev) => {
                      const next = [...prev.tips];
                      next[index] = value;
                      return { ...prev, tips: next };
                    });
                  }}
                />
                <button
                  className="text-red-400 text-sm"
                  onClick={() =>
                    setResourceForm((prev) => ({
                      ...prev,
                      tips: prev.tips.filter((_, tipIndex) => tipIndex !== index)
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="text-primary-container text-sm"
              onClick={() => setResourceForm((prev) => ({ ...prev, tips: [...prev.tips, ''] }))}
            >
              + Add Tip
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-on-surface-variant text-sm">Resources (label + url)</p>
            {resourceForm.resources.map((item, index) => (
              <div key={`resource-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
                  placeholder="Label"
                  value={item.label}
                  onChange={(event) => {
                    const value = event.target.value;
                    setResourceForm((prev) => {
                      const next = [...prev.resources];
                      next[index] = { ...next[index], label: value };
                      return { ...prev, resources: next };
                    });
                  }}
                />
                <div className="flex gap-2">
                  <input
                    className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 flex-1 text-on-surface"
                    placeholder="URL"
                    value={item.url}
                    onChange={(event) => {
                      const value = event.target.value;
                      setResourceForm((prev) => {
                        const next = [...prev.resources];
                        next[index] = { ...next[index], url: value };
                        return { ...prev, resources: next };
                      });
                    }}
                  />
                  <button
                    className="text-red-400 text-sm"
                    onClick={() =>
                      setResourceForm((prev) => ({
                        ...prev,
                        resources: prev.resources.filter((_, resIndex) => resIndex !== index)
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              className="text-primary-container text-sm"
              onClick={() =>
                setResourceForm((prev) => ({
                  ...prev,
                  resources: [...prev.resources, { label: '', url: '' }]
                }))
              }
            >
              + Add Resource Link
            </button>
          </div>

          <input
            className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
            placeholder="Quiz topic slug (optional)"
            value={resourceForm.quizTopic}
            onChange={(event) => setResourceForm((prev) => ({ ...prev, quizTopic: event.target.value }))}
          />
          <div className="flex gap-3">
            <button className="cyber-button" onClick={handleResourceSubmit}>
              {resourceForm.id ? 'Save Resource' : 'Add Resource'}
            </button>
            {resourceForm.id && (
              <button
                className="px-4 py-2 rounded-xl border border-outline-variant/30 text-on-surface"
                onClick={() => setResourceForm(emptyResourceForm)}
              >
                Cancel
              </button>
            )}
          </div>
          {formStatus.resource === 'success' && <p className="text-primary-container text-sm">Resource saved.</p>}
          {formStatus.resource === 'error' && <p className="text-red-400 text-sm">Failed to save resource.</p>}
        </div>

        <div className="glass-panel p-6 space-y-4">
          <h2 className="font-headline text-on-surface text-xl">{quizForm.id ? 'Edit Quiz' : 'Add Quiz'}</h2>
          <input
            className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
            placeholder="Topic slug (e.g. phishing-awareness)"
            value={quizForm.topic}
            onChange={(event) => setQuizForm((prev) => ({ ...prev, topic: event.target.value }))}
          />
          <div className="space-y-4">
            {quizForm.questions.map((question, qIndex) => (
              <div key={`question-${qIndex}`} className="bg-surface-container-low/60 border border-outline-variant/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-on-surface-variant text-sm">Question {qIndex + 1}</p>
                  <button
                    className="text-red-400 text-sm"
                    onClick={() =>
                      setQuizForm((prev) => ({
                        ...prev,
                        questions: prev.questions.filter((_, index) => index !== qIndex)
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
                <input
                  className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 w-full text-on-surface"
                  placeholder="Question text"
                  value={question.question}
                  onChange={(event) => {
                    const value = event.target.value;
                    setQuizForm((prev) => {
                      const next = [...prev.questions];
                      next[qIndex] = { ...next[qIndex], question: value };
                      return { ...prev, questions: next };
                    });
                  }}
                />
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div key={`option-${qIndex}-${oIndex}`} className="flex gap-2">
                      <input
                        className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 flex-1 text-on-surface"
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(event) => {
                          const value = event.target.value;
                          setQuizForm((prev) => {
                            const next = [...prev.questions];
                            const options = [...next[qIndex].options];
                            options[oIndex] = value;
                            next[qIndex] = { ...next[qIndex], options };
                            return { ...prev, questions: next };
                          });
                        }}
                      />
                      <button
                        className="text-red-400 text-sm"
                        onClick={() =>
                          setQuizForm((prev) => {
                            const next = [...prev.questions];
                            const options = next[qIndex].options.filter((_, index) => index !== oIndex);
                            next[qIndex] = { ...next[qIndex], options };
                            return { ...prev, questions: next };
                          })
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    className="text-primary-container text-sm"
                    onClick={() =>
                      setQuizForm((prev) => {
                        const next = [...prev.questions];
                        next[qIndex] = { ...next[qIndex], options: [...next[qIndex].options, ''] };
                        return { ...prev, questions: next };
                      })
                    }
                  >
                    + Add Option
                  </button>
                </div>
                <input
                  className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 w-full text-on-surface"
                  placeholder="Correct answer (must match an option)"
                  value={question.correctAnswer}
                  onChange={(event) => {
                    const value = event.target.value;
                    setQuizForm((prev) => {
                      const next = [...prev.questions];
                      next[qIndex] = { ...next[qIndex], correctAnswer: value };
                      return { ...prev, questions: next };
                    });
                  }}
                />
                <input
                  className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 w-full text-on-surface"
                  placeholder="Explanation (optional)"
                  value={question.explanation}
                  onChange={(event) => {
                    const value = event.target.value;
                    setQuizForm((prev) => {
                      const next = [...prev.questions];
                      next[qIndex] = { ...next[qIndex], explanation: value };
                      return { ...prev, questions: next };
                    });
                  }}
                />
              </div>
            ))}
          </div>
          <button
            className="text-primary-container text-sm"
            onClick={() =>
              setQuizForm((prev) => ({
                ...prev,
                questions: [
                  ...prev.questions,
                  { question: '', options: ['', ''], correctAnswer: '', explanation: '' }
                ]
              }))
            }
          >
            + Add Question
          </button>
          <div className="flex gap-3">
            <button className="cyber-button" onClick={handleQuizSubmit}>
              {quizForm.id ? 'Save Quiz' : 'Add Quiz'}
            </button>
            {quizForm.id && (
              <button
                className="px-4 py-2 rounded-xl border border-outline-variant/30 text-on-surface"
                onClick={() => setQuizForm(emptyQuizForm)}
              >
                Cancel
              </button>
            )}
          </div>
          {formStatus.quiz === 'success' && <p className="text-primary-container text-sm">Quiz saved.</p>}
          {formStatus.quiz === 'error' && <p className="text-red-400 text-sm">Failed to save quiz.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
