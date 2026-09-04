import { Mail, MessageCircle } from "lucide-react";

const ContactPage = () => (
  <section className="min-h-[calc(100vh-4rem)] bg-background px-5 py-14 md:px-16 md:py-20">
    <div className="mx-auto max-w-3xl rounded-2xl border border-outline-variant bg-surface-container-lowest p-7 shadow-xl shadow-primary/5 md:p-10">
      <p className="text-label-caps font-semibold text-secondary">SUPPORT</p>
      <h1 className="mt-3 text-headline-xl font-semibold text-primary">
        We’re here to help.
      </h1>
      <p className="mt-3 max-w-xl text-body-lg text-on-surface-variant">
        Questions, feedback, or a problem with your account? Send us a note and
        include the email on your Pods account.
      </p>
      <div className="mt-6 rounded-xl bg-surface-container-low p-5">
        <p className="text-label-caps font-semibold text-secondary">
          YOUR SUPPORT CONTACT
        </p>
        <p className="mt-2 text-body-md font-semibold text-primary">
          Akshar Rawat
        </p>
        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-body-sm text-on-surface-variant">
          <a
            className="hover:text-primary hover:underline"
            href="mailto:aksharrawat7@gmail.com"
          >
            aksharrawat7@gmail.com
          </a>
          <a
            className="hover:text-primary hover:underline"
            href="https://www.linkedin.com/in/akshar-rawat-475a61317/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn profile
          </a>
        </div>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:aksharrawat7@gmail.com"
          className="interactive-lift rounded-xl border border-outline-variant p-5"
        >
          <Mail size={20} className="text-secondary" />
          <h2 className="mt-4 text-body-md font-semibold text-primary">
            Email support
          </h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            aksharrawat7@gmail.com
          </p>
        </a>
        <a
          href="mailto:aksharrawat7@gmail.com"
          className="interactive-lift rounded-xl border border-outline-variant p-5"
        >
          <MessageCircle size={20} className="text-secondary" />
          <h2 className="mt-4 text-body-md font-semibold text-primary">
            Share feedback
          </h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            aksharrawat7@gmail.com
          </p>
        </a>
      </div>
    </div>
  </section>
);

export default ContactPage;
