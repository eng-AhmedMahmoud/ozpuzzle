/** Single puzzle-piece glyph (knobs top + right) used as logo mark and decoration. */
export default function PieceIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 110 110" className={className} style={style} aria-hidden>
      <path
        fill="currentColor"
        d="M20 20 L45 20 A12 12 0 1 0 65 20 L90 20 L90 45 A12 12 0 1 0 90 65 L90 90 L20 90 Z"
      />
    </svg>
  );
}
