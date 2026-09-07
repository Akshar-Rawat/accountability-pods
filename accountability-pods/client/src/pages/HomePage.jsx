import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Flame, MessageCircle, Users } from "lucide-react";

const HomePage = () => {
  const steps = [
    ["01", "Find your people", "Join a small, focused pod built around the habit you want to keep.", Users],
    ["02", "Show up daily", "Share a quick check-in and make progress visible to the people who matter.", Check],
    ["03", "Let it compound", "A steady rhythm turns an ambitious goal into a streak you can trust.", Flame],
  ];

  return (
    <main className="overflow-hidden bg-surface text-on-surface">
      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-container flex-col justify-center px-5 py-24 md:px-16">
        <div className="pointer-events-none absolute right-[-10%] top-[9%] h-[32rem] w-[32rem] rounded-full bg-[#6a4cf5]/20 blur-[120px]" />
        <p className="animate-pods-enter mb-7 text-xs font-medium tracking-tight text-[#0099ff]">ACCOUNTABILITY, MADE HUMAN</p>
        <h1 className="animate-pods-enter animate-pods-enter-1 relative max-w-5xl text-[clamp(4rem,10vw,8rem)] font-medium leading-[.86] tracking-[-.07em] text-primary">
          Keep promises<br />to yourself.
        </h1>
        <div className="animate-pods-enter animate-pods-enter-2 relative mt-10 flex max-w-xl flex-col gap-7 md:ml-[34%]">
          <p className="text-lg leading-[1.3] tracking-[-.02em] text-on-surface-variant">
            Pact puts you in a small circle of people who are working toward the same thing. Check in, encourage each other, and build momentum that lasts.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-on-primary transition-transform hover:scale-[1.02] active:scale-[.98]">Start your pact <ArrowUpRight size={16} /></Link>
            <a href="#how-it-works" className="inline-flex min-h-11 items-center rounded-full bg-surface-container-low px-5 text-sm font-medium text-primary transition-colors hover:bg-surface-container-high">How it works</a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-container px-5 py-20 md:px-16 md:py-28">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 className="max-w-2xl text-[clamp(2.8rem,6vw,5.3rem)] font-medium leading-[.91] tracking-[-.065em] text-primary">Small moves.<br />Real momentum.</h2><p className="max-w-xs text-sm leading-snug text-on-surface-variant">There’s no feed to perform for. Just a better system for showing up.</p></div>
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map(([number, title, description, Icon], index) => (
            <article key={number} className={`interactive-lift min-h-72 rounded-[20px] p-7 ${index === 1 ? "bg-[radial-gradient(circle_at_85%_15%,#d44df0,transparent_33%),linear-gradient(135deg,#6a4cf5,#151127_70%)]" : "bg-surface-container-low"}`}>
              <div className="flex items-start justify-between text-sm text-on-surface-variant"><span>{number}</span><Icon size={20} className="text-primary" /></div>
              <div className="mt-24"><h3 className="text-2xl font-medium tracking-[-.04em] text-primary">{title}</h3><p className="mt-3 max-w-xs text-sm leading-snug text-on-surface-variant">{description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-container gap-3 px-5 py-8 md:grid-cols-[1.2fr_.8fr] md:px-16 md:py-16">
        <div className="rounded-[30px] bg-[radial-gradient(circle_at_80%_18%,#ff7a3d,transparent_31%),radial-gradient(circle_at_30%_80%,#d44df0,transparent_36%),#6a4cf5] p-8 md:min-h-[430px] md:p-11">
          <p className="text-sm font-medium text-white/70">DAILY, NOT PERFECT</p><h2 className="mt-4 max-w-md text-5xl font-medium leading-[.9] tracking-[-.06em] text-white md:text-6xl">Your streak is a story.</h2><p className="mt-7 max-w-sm text-base leading-snug text-white/80">Every check-in gives your future self a little more evidence that you can follow through.</p>
        </div>
        <div className="rounded-[20px] bg-surface-container-low p-7 md:flex md:flex-col md:justify-between">
          <div className="flex items-start justify-between"><div><p className="text-xs text-on-surface-variant">CURRENT STREAK</p><p className="mt-2 text-5xl font-medium tracking-[-.06em] text-primary">24</p><p className="text-sm text-on-surface-variant">days in a row</p></div><Flame className="text-[#ff7a3d]" size={28} /></div>
          <div className="mt-16 border-t border-outline-variant pt-5"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm text-on-primary">A</div><p className="text-sm text-primary">Alex checked in</p></div><div className="mt-4 flex items-center gap-2 text-sm text-[#0099ff]"><MessageCircle size={16} /> Your pact is rooting for you</div></div>
        </div>
      </section>

      <section className="mx-auto max-w-container px-5 py-28 text-center md:px-16 md:py-36"><p className="text-sm text-[#0099ff]">MAKE A PACT</p><h2 className="mx-auto mt-5 max-w-3xl text-[clamp(3.4rem,7vw,6.5rem)] font-medium leading-[.86] tracking-[-.07em] text-primary">The work is yours.<br />You don’t have to do it alone.</h2><Link to="/register" className="mt-10 inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-on-primary transition-transform hover:scale-[1.02]">Get started for free</Link></section>
    </main>
  );
};

export default HomePage;
