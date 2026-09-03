import NotificationSettings from "../components/NotificationSettings";

const NotificationsPage = () => (
  <section className="min-h-[calc(100vh-4rem)] bg-background px-5 py-14 md:px-16 md:py-20">
    <div className="mx-auto max-w-2xl">
      <p className="text-label-caps font-semibold text-secondary">PREFERENCES</p>
      <h1 className="mt-3 text-headline-xl font-semibold text-primary">Notifications</h1>
      <p className="mt-3 text-body-lg text-on-surface-variant">Choose whether Pods can remind you when your check-in is due.</p>
      <div className="mt-10"><NotificationSettings /></div>
    </div>
  </section>
);

export default NotificationsPage;
