import { Link } from "react-router-dom";

const legalContent = {
  privacy: {
    eyebrow: "PRIVACY",
    title: "Privacy Policy",
    sections: [
      ["What we collect", "We collect the account details, profile image, timezone, pod activity, and messages you provide to operate Pods."],
      ["How we use it", "Your information is used to create your account, show your activity to your pod members, maintain streaks, and send reminders you choose to enable."],
      ["Your choices", "You can leave a pod, update account details, and disable browser notifications at any time. Contact us if you need help with account data."],
    ],
  },
  terms: {
    eyebrow: "TERMS",
    title: "Terms of Service",
    sections: [
      ["Using Pods", "Use Pods respectfully and only share content you have the right to share. Pod activity is visible to the members of that pod."],
      ["Your account", "Keep your account credentials private and provide accurate details. You are responsible for the activity performed through your account."],
      ["Service availability", "We work to keep Pods available, but the service may change as we improve it. These terms may be updated when the product changes."],
    ],
  },
};

const LegalPage = ({ type }) => {
  const content = legalContent[type];

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background px-5 py-14 md:px-16 md:py-20">
      <article className="mx-auto max-w-3xl rounded-[20px] border border-outline-variant bg-surface-container-low p-7 shadow-xl shadow-black/20 md:p-10">
        <p className="text-label-caps font-semibold text-secondary">{content.eyebrow}</p>
        <h1 className="mt-3 text-headline-xl font-semibold text-primary">{content.title}</h1>
        <p className="mt-3 text-body-sm text-on-surface-variant">Last updated: September 3, 2026</p>
        <div className="mt-10 space-y-8">
          {content.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-headline-md font-semibold text-primary">{heading}</h2>
              <p className="mt-2 text-body-lg text-on-surface-variant">{body}</p>
            </section>
          ))}
        </div>
        <Link to="/contact" className="mt-10 inline-flex text-body-sm font-semibold text-secondary hover:underline">
          Questions about this policy? Contact us
        </Link>
      </article>
    </section>
  );
};

export default LegalPage;
