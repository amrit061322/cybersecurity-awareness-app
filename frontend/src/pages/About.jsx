const About = () => {
  return (
    <div
      className="max-w-5xl mx-auto px-4 py-12 space-y-6 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?technology,security')" }}
    >
      <div className="glass-panel p-8 space-y-4 relative overflow-hidden">
        <div className="scanner-line opacity-30"></div>
        <p className="uppercase tracking-[0.3em] text-primary-container text-xs">About CyberAware</p>
        <h1 className="section-title">Building practical cyber awareness for everyone.</h1>
        <p className="text-on-surface-variant">
          CyberAware is a cyber security awareness platform designed to help people recognize modern threats, build safer
          online habits, and gain confidence through hands-on learning. We combine curated learning resources with real-time
          quizzes and progress tracking so users can measure and improve their security awareness over time.
        </p>
        <p className="text-on-surface-variant">
          Our mission is to make cyber safety approachable and actionable. Whether you are just getting started or want to
          sharpen your skills, CyberAware delivers clear guidance on phishing, passwords, social engineering, ransomware,
          privacy, and more.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-3">
          <h2 className="font-headline text-on-surface text-xl">What we do</h2>
          <ul className="text-on-surface-variant text-sm space-y-2">
            <li>Provide trusted cyber security learning resources and tips.</li>
            <li>Deliver interactive quizzes with real-time scoring.</li>
            <li>Track awareness levels and progress over time.</li>
            <li>Offer admin analytics to improve training outcomes.</li>
            <li>Collect feedback to keep improving the experience.</li>
          </ul>
        </div>
        <div className="glass-panel p-6 space-y-3">
          <h2 className="font-headline text-on-surface text-xl">Who it is for</h2>
          <ul className="text-on-surface-variant text-sm space-y-2">
            <li>Students and learners building cyber safety fundamentals.</li>
            <li>Individuals wanting to protect personal data and accounts.</li>
            <li>Teams and organizations measuring awareness progress.</li>
            <li>Admins who need visibility into training effectiveness.</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-3">
        <h2 className="font-headline text-on-surface text-xl">Our values</h2>
        <p className="text-on-surface-variant text-sm">
          We believe security awareness should be practical, measurable, and engaging. Our content focuses on real-world
          threats and safe behaviors users can apply immediately.
        </p>
      </div>
    </div>
  );
};

export default About;
