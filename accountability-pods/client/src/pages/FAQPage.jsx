import Accordion from "../components/ui/Accordion";

const FAQPage = () => {
  const items = [
    { value: "pods", title: "What is a pod?", content: "A pod is a focused group of people who commit to the same habit or goal and encourage each other to keep going." },
    { value: "checkins", title: "How do check-ins work?", content: "Open your pod and complete your daily check-in. You can add a note and optionally attach proof of your work." },
    { value: "streaks", title: "How are streaks calculated?", content: "A streak grows when you check in on each scheduled day. Missing a scheduled check-in starts a new current streak while your longest streak remains saved." },
    { value: "notifications", title: "How do I enable reminders?", content: "Use the bell in the navigation bar, allow browser notifications, then enable reminders. You can change this later in your browser settings." },
  ];

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background px-5 py-14 md:px-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-label-caps font-semibold text-secondary">HELP CENTER</p>
        <h1 className="mt-3 max-w-2xl text-headline-xl font-medium tracking-[-.055em] text-primary">Frequently asked questions</h1>
        <p className="mt-3 text-body-lg text-on-surface-variant">Everything you need to get started and keep your pod moving.</p>
        <div className="mt-10 rounded-[15px] bg-surface-container-low shadow-lg shadow-black/20"><Accordion items={items} defaultValue="pods" /></div>
      </div>
    </section>
  );
};

export default FAQPage;
