
const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-5 py-12 md:px-16 max-w-container mx-auto">
        <div className="mb-8 md:mb-0">
          <span className="text-headline-md text-headline-md font-bold text-primary">
            Pods
          </span>
          <p className="text-body-sm text-body-sm text-on-surface-variant mt-2">
            © 2024 Pods. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a
            className="text-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Contact
          </a>
          <a
            className="text-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
