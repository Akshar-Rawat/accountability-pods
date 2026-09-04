import { Link } from "react-router-dom";
import {
  Users,
  CheckSquare,
  TrendingUp,
  Flame,
  MessageCircle,
} from "lucide-react";

const HomePage = () => {
  const steps = [
    {
      number: "01",
      icon: Users,
      title: "Join a Pod",
      description:
        "Find a group focused on your specific goal and stay accountable together.",
    },
    {
      number: "02",
      icon: CheckSquare,
      title: "Commit Daily",
      description:
        "Check in on your progress and make consistency part of your routine.",
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "Build Your Streak",
      description:
        "Keep showing up and turn small daily actions into lasting progress.",
    },
  ];

  return (
    <div className="overflow-hidden bg-surface text-on-surface">
      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-container items-center gap-12 px-5 py-14 md:grid-cols-2 md:px-16 md:py-20">
        <div className="pointer-events-none absolute -left-32 top-16 size-72 rounded-full bg-secondary-fixed/30 blur-3xl" />
        <div className="max-w-xl">
          <p className="animate-pods-enter mb-4 inline-flex rounded-full bg-secondary-container px-3 py-1.5 text-label-caps font-semibold text-on-secondary-container">
            PACT
          </p>

          <h1 className="animate-pods-enter animate-pods-enter-1 text-headline-xl text-5xl font-semibold leading-[1.04] tracking-[-0.05em] text-primary md:text-6xl">
            Build momentum.<br />Together.
          </h1>

          <p className="animate-pods-enter animate-pods-enter-2 mt-5 max-w-lg text-body-lg leading-7 text-on-surface-variant">
            Join focused pods to build better habits, stay consistent, and
            make progress together.
          </p>

          <div className="animate-pods-enter animate-pods-enter-3 mt-8 flex flex-wrap gap-3">
            <Link
              to="/pods"
              className="rounded-lg bg-primary px-6 py-3 text-body-sm font-semibold text-on-primary shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-xl"
            >
              Get Started
            </Link>

            <a
              href="#how-it-works"
              className="rounded-lg border border-outline-variant bg-surface/70 px-6 py-3 text-body-sm font-semibold text-primary transition-colors hover:bg-surface-container-low"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="animate-pods-enter animate-pods-enter-2 relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-outline-variant bg-gradient-to-br from-surface-container-lowest to-secondary-fixed/35 p-8 shadow-2xl shadow-primary/10">
          <div className="animate-pods-orbit absolute -right-12 -top-12 size-40 rounded-full border-[24px] border-secondary/20" />
          <div className="relative h-64 w-64 rounded-full border border-outline-variant bg-surface/40 shadow-inner">
            <div className="absolute inset-10 rounded-full border border-outline-variant" />

            <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary" />

            <div className="absolute left-6 top-8 flex size-10 items-center justify-center rounded-full bg-primary text-on-primary">
              <Users size={18} />
            </div>

            <div className="absolute right-5 top-20 flex size-10 items-center justify-center rounded-full bg-secondary text-on-secondary">
              <Flame size={18} />
            </div>

            <div className="absolute bottom-8 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-on-primary">
              <TrendingUp size={18} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-outline-variant bg-surface-container-lowest py-7">
        <div className="mx-auto flex max-w-container flex-wrap justify-between gap-5 px-5 md:px-16">
          {["Focus", "Linear", "Notion", "Superhuman", "Deepwork"].map(
            (name) => (
              <span
                key={name}
                className="text-body-md font-bold uppercase tracking-widest text-primary opacity-40"
              >
                {name}
              </span>
            ),
          )}
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-container px-5 py-16 md:px-16 md:py-20"
      >
        <h2 className="text-headline-lg font-semibold text-primary">
          A simple system for discipline.
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="interactive-lift rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-label-caps font-semibold text-secondary">
                    {step.number}
                  </span>

                  <Icon size={20} className="text-on-surface-variant" />
                </div>

                <h3 className="mt-5 text-headline-md font-medium text-primary">
                  {step.title}
                </h3>

                <p className="mt-2 text-body-md text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-outline-variant bg-surface-container-lowest">
        <div className="mx-auto grid max-w-container items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-16 md:py-20">
          <div>
            <span className="text-label-caps font-semibold text-secondary">
              CONSISTENCY
            </span>

            <h2 className="mt-3 text-headline-xl font-semibold text-primary">
              Streaks that matter.
            </h2>

            <p className="mt-3 max-w-lg text-body-lg text-on-surface-variant">
              Track your commitment without unnecessary distractions. Your
              progress stays visible and meaningful.
            </p>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface p-7 shadow-lg shadow-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label-caps text-on-surface-variant">
                  CURRENT STREAK
                </p>

                <p className="mt-1 text-headline-xl font-semibold text-primary">
                  24 days
                </p>
              </div>

              <Flame size={26} className="text-secondary" />
            </div>

            <div className="mt-8">
              <div className="mb-2 flex justify-between text-label-caps">
                <span className="text-on-surface-variant">
                  30 DAY PROGRESS
                </span>

                <span className="text-secondary">80%</span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-secondary-fixed/30">
                <div className="h-full w-4/5 bg-secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-container items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-16 md:py-20">
        <div className="order-2 rounded-2xl border border-outline-variant bg-surface-container-lowest p-7 shadow-lg shadow-primary/5 md:order-1">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-on-primary">
                A
              </div>

              <div>
                <p className="text-label-caps text-on-surface-variant">
                  ALEX · 05:12 AM
                </p>

                <p className="mt-1 text-body-sm text-primary">
                  Finished my first deep work block.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-sm font-medium text-primary">
                S
              </div>

              <div>
                <p className="text-label-caps text-on-surface-variant">
                  SARAH · 05:28 AM
                </p>

                <p className="mt-1 text-body-sm text-primary">
                  Checked in too. Let's keep the momentum.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-outline-variant pt-4 text-secondary">
              <MessageCircle size={16} />
              <span className="text-label-caps font-semibold">
                POD IS ACTIVE
              </span>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <span className="text-label-caps font-semibold text-secondary">
            ACCOUNTABILITY
          </span>

          <h2 className="mt-3 text-headline-xl font-semibold text-primary">
            Progress is better together.
          </h2>

          <p className="mt-3 text-body-lg text-on-surface-variant">
            Share progress, encourage your teammates, and keep moving when
            motivation fades.
          </p>
        </div>
      </section>

      <section className="border-t border-outline-variant px-5 py-16 text-center md:py-20">
        <h2 className="text-headline-lg font-semibold text-primary">
          Discipline compounds.
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-body-lg text-on-surface-variant">
          Start small. Show up every day. Let your pod turn consistency into
          something that lasts.
        </p>

        <Link
          to="/pods"
          className="mt-6 inline-flex rounded-lg bg-primary px-7 py-3 text-label-caps font-semibold text-on-primary shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary-container"
        >
          GET STARTED
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
