import { RecipeBook } from "@/api_client/recipes";

export const widthPx = 40;

const ClosedRecipeBook = ({
  recipeBook,
  onOpen,
}: {
  recipeBook: RecipeBook;
  onOpen?: (recipeBookId: string) => void;
}) => {
  const bookPalette = [
    {
      base: "#2f6f6a",
      edge: "#255954",
      line: "#1e4743",
      text: "#1b2726",
    },
    {
      base: "#d8a7b8",
      edge: "#b98395",
      line: "#8d6271",
      text: "#40282f",
    },
    {
      base: "#b53f2e",
      edge: "#8f3023",
      line: "#6f241b",
      text: "#2d1714",
    },
    {
      base: "#476db5",
      edge: "#39588f",
      line: "#2f4772",
      text: "#182234",
    },
    {
      base: "#e5d1aa",
      edge: "#bda97f",
      line: "#8e7e5d",
      text: "#4b4130",
    },
    {
      base: "#d07a4d",
      edge: "#a6603d",
      line: "#7f492f",
      text: "#3c241a",
    },
    {
      base: "#b9d0cf",
      edge: "#91acab",
      line: "#6e8786",
      text: "#2d3b3a",
    },
    {
      base: "#8ea274",
      edge: "#70815c",
      line: "#586748",
      text: "#283023",
    },
    {
      base: "#8a68ad",
      edge: "#6c5288",
      line: "#513d66",
      accent: "#cdbddd",
      text: "#261f32",
    },
    {
      base: "#e2e0d7",
      edge: "#b9b5aa",
      line: "#8e897d",
      text: "#444139",
    },
    {
      base: "#d58e8e",
      edge: "#b46f6f",
      line: "#8a5454",
      text: "#3d2424",
    },
    {
      base: "#efb840",
      edge: "#c49229",
      line: "#92701f",
      text: "#3e3112",
    },
  ];

  const hash = recipeBook.name
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const palette = bookPalette[hash % bookPalette.length];

  // More natural variation
  const heightPx = 125 + (hash % 35);

  const hasTopBand = hash % 2 === 0;
  const hasBottomBand = hash % 3 === 0;
  const tilt = [-1, 0, 1][hash % 3];

  return (
    <button
      type="button"
      onClick={() => onOpen?.(recipeBook.id)}
      aria-label={`Open ${recipeBook.name}`}
      className={`
        group relative overflow-hidden rounded-[2px]
        transition-all duration-100
        ${onOpen ? "cursor-pointer hover:-translate-y-3 hover:shadow-md" : ""}
      `}
      style={{
        width: `${widthPx}px`,
        height: `${heightPx}px`,
        // transform: `rotate(${tilt}deg)`,
        background: `
          linear-gradient(
            to right,
            ${palette.edge} 0px,
            ${palette.edge} 5px,
            ${palette.base} 5px,
            ${palette.base} 50%,
            ${palette.edge} 100%
          )
        `,
      }}
    >
      {/* Top Decorative Band */}
      {hasTopBand && (
        <div
          className="absolute left-[8px] right-[6px] top-[10px] h-[14px] rounded-[1px]"
          style={{
            borderTop: `1.5px solid ${palette.line}`,
            borderBottom: `1.5px solid ${palette.line}`,
          }}
        />
      )}

      {/* Bottom Decorative Band */}
      {hasBottomBand && (
        <div
          className="absolute left-[8px] right-[6px] bottom-[10px] h-[14px] rounded-[1px]"
          style={{
            borderTop: `1.5px solid ${palette.line}`,
            borderBottom: `1.5px solid ${palette.line}`,
          }}
        />
      )}

      {/* Title */}
      <div className="absolute inset-0 flex items-center justify-center px-[6px]">
        <p
          className="rotate-180 text-[11px] leading-none tracking-[0.08em] font-medium truncate"
          style={{
            writingMode: "vertical-rl",
            color: palette.text,
            fontFamily: "Georgia, serif",
            textTransform: "lowercase",
          }}
        >
          {recipeBook.name}
        </p>
      </div>
    </button>
  );
};

export default ClosedRecipeBook;