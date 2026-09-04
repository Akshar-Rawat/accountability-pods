const BrandMark = ({ compact = false, className = "" }) => (
  <span className={`inline-flex items-center ${className}`}>
    <span
      className={`${compact ? "text-lg" : "text-xl"} font-extrabold tracking-tight text-primary`}
    >
      Pact
    </span>
  </span>
);

export default BrandMark;
