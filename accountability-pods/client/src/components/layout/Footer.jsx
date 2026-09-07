
import BrandMark from "../BrandMark";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-outline-variant bg-surface-container-lowest">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-5 py-12 md:px-16 max-w-container mx-auto">
        <div className="mb-8 md:mb-0">
          <BrandMark />
          <p className="mt-2 text-body-sm text-on-surface-variant">
            © 2026 Pact. Build consistency together.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link
            className="text-label-caps text-on-surface-variant transition-colors hover:text-primary"
            to="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-label-caps text-on-surface-variant transition-colors hover:text-primary"
            to="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-label-caps text-on-surface-variant transition-colors hover:text-primary"
            to="/contact"
          >
            Contact
          </Link>
          <Link
            className="text-label-caps text-on-surface-variant transition-colors hover:text-primary"
            to="/faq"
          >
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { Link } from "react-router-dom";
