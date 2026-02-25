import { RecipeBook } from "@/api_client/recipes";

const ClosedRecipeBook = ({
  recipeBook,
  onOpen,
}: {
  recipeBook: RecipeBook;
  onOpen?: (recipeBookId: string) => void;
}) => {
  const bookPalette = [
    {
      base: "#c2410c",
      gradient: "linear-gradient(to bottom, #fdba74, #ea580c, #c2410c)",
      hoverBase: "#ea580c",
      hoverGradient: "linear-gradient(to bottom, #ffedd5, #fdba74, #ea580c)",
      spine: "#7c2d12",
    },

    {
      base: "#a16207",
      gradient: "linear-gradient(to bottom, #fde68a, #d97706, #a16207)",
      hoverBase: "#d97706",
      hoverGradient: "linear-gradient(to bottom, #fef3c7, #fde68a, #d97706)",
      spine: "#78350f",
    },

    {
      base: "#6b7280",
      gradient: "linear-gradient(to bottom, #d1d5db, #9ca3af, #6b7280)",
      hoverBase: "#9ca3af",
      hoverGradient: "linear-gradient(to bottom, #f3f4f6, #d1d5db, #9ca3af)",
      spine: "#374151",
    },

    {
      base: "#4d7c0f",
      gradient: "linear-gradient(to bottom, #bef264, #65a30d, #4d7c0f)",
      hoverBase: "#65a30d",
      hoverGradient: "linear-gradient(to bottom, #ecfccb, #bef264, #65a30d)",
      spine: "#365314",
    },

    {
      base: "#8b7355",
      gradient: "linear-gradient(to bottom, #e7d7c1, #b08968, #8b7355)",
      hoverBase: "#b08968",
      hoverGradient: "linear-gradient(to bottom, #f3e7d3, #e7d7c1, #b08968)",
      spine: "#5c4033",
    },

    {
      base: "#5a3e36",
      gradient: "linear-gradient(to bottom, #a47148, #7f5539, #5a3e36)",
      hoverBase: "#7f5539",
      hoverGradient: "linear-gradient(to bottom, #e6ccb2, #a47148, #7f5539)",
      spine: "#3b2a23",
    },

    {
      base: "#64748b",
      gradient: "linear-gradient(to bottom, #cbd5e1, #94a3b8, #64748b)",
      hoverBase: "#94a3b8",
      hoverGradient: "linear-gradient(to bottom, #f1f5f9, #cbd5e1, #94a3b8)",
      spine: "#334155",
    },

    {
      base: "#1e3a5f",
      gradient: "linear-gradient(to bottom, #93c5fd, #3b82f6, #1e3a5f)",
      hoverBase: "#3b82f6",
      hoverGradient: "linear-gradient(to bottom, #dbeafe, #93c5fd, #3b82f6)",
      spine: "#172554",
    },

    {
      base: "#9d4edd",
      gradient: "linear-gradient(to bottom, #e9d5ff, #c084fc, #9d4edd)",
      hoverBase: "#c084fc",
      hoverGradient: "linear-gradient(to bottom, #f5f3ff, #e9d5ff, #c084fc)",
      spine: "#5b21b6",
    },

    {
      base: "#7f1d1d",
      gradient: "linear-gradient(to bottom, #fca5a5, #b91c1c, #7f1d1d)",
      hoverBase: "#b91c1c",
      hoverGradient: "linear-gradient(to bottom, #fee2e2, #fca5a5, #b91c1c)",
      spine: "#450a0a",
    },

    {
      base: "#78716c",
      gradient: "linear-gradient(to bottom, #e7e5e4, #a8a29e, #78716c)",
      hoverBase: "#a8a29e",
      hoverGradient: "linear-gradient(to bottom, #f5f5f4, #e7e5e4, #a8a29e)",
      spine: "#44403c",
    },

    {
      base: "#d6c7b2",
      gradient: "linear-gradient(to bottom, #f5efe6, #e7d7c1, #d6c7b2)",
      hoverBase: "#e7d7c1",
      hoverGradient: "linear-gradient(to bottom, #faf6f0, #f5efe6, #e7d7c1)",
      spine: "#a68a64",
    },
  ];

  const paletteIndex = recipeBook.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % bookPalette.length;
  const palette = bookPalette[paletteIndex];
  const heightPx = 120 + 2*recipeBook.name.length;

  return (
    <button
      type="button"
      onClick={() => onOpen?.(recipeBook.id)}
      aria-label={`Open ${recipeBook.name}`}
      className={`
        group
        relative
        w-12
        rounded-[2px]
        border
        border-l-[5px]
        border-black/15
        book-spine
        shadow-md
        flex
        items-center
        justify-center
        overflow-hidden
        transition
        ${onOpen ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/70 focus-visible:ring-offset-2" : ""}
      `}
      style={{
        height: `${heightPx}px`,
        backgroundColor: palette.base,
        ["--book-gradient" as string]: palette.gradient,
        ["--book-gradient-hover" as string]: palette.hoverGradient,
        borderLeftColor: palette.spine,
      }}
    >
      <div className="absolute left-0 right-0 top-0 h-1 bg-white/25" />
      <div className={`z-10 h-[88%] flex items-start justify-start -ml-3`}>
        <p
          className="rotate-180 text-[12px] tracking-wide text-stone-900 font-semibold"
          style={{
            fontFamily: "Georgia",
            writingMode: "sideways-lr",
          }}
        >
          {recipeBook.name}
        </p>
      </div>
    </button>
  );
};

export default ClosedRecipeBook;
