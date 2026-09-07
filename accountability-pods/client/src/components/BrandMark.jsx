const BrandMark = ({ compact = false, className = "" }) => (
  <span className={`inline-flex items-center ${className}`}>
    <span
      className={`${compact ? "text-lg" : "text-xl"} font-medium tracking-[-0.07em] text-primary`}
    >
      Pact
    </span>
  </span>
);

export default BrandMark;
