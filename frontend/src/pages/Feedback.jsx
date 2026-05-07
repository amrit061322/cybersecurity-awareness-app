import FeedbackForm from '../components/FeedbackForm';

const Feedback = () => {
  return (
    <div
      className="pt-24 pb-32 px-4 max-w-4xl mx-auto space-y-8 relative overflow-hidden page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?feedback,technology')" }}
    >
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(132,148,149,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(132,148,149,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      ></div>
      <div className="glass-panel p-6 relative overflow-hidden border border-outline-variant/20">
        <div className="scanner-line opacity-20"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border border-primary-container/40 bg-surface-container-highest flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined">edit_note</span>
          </div>
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-primary-fixed-dim">Initialize Feedback Packet</p>
            <h1 className="font-headline text-3xl text-on-surface">Share Feedback</h1>
            <p className="text-on-surface-variant mt-2">
              Your feedback helps improve training clarity, accuracy, and real-world relevance.
            </p>
          </div>
        </div>
      </div>
      <FeedbackForm />
    </div>
  );
};

export default Feedback;
