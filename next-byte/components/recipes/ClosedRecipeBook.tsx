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
      base: "#a8654b",
      gradient: "linear-gradient(to bottom, #dec3b5, #c8957f, #a8654b)",
      hoverBase: "#b97b60",
      hoverGradient: "linear-gradient(to bottom, #ecdbd2, #dec3b5, #b97b60)",
      spine: "#7f4e3d",
    },

    {
      base: "#9f7a3f",
      gradient: "linear-gradient(to bottom, #ddd0ad, #c3aa74, #9f7a3f)",
      hoverBase: "#b18e53",
      hoverGradient: "linear-gradient(to bottom, #ebe2ca, #ddd0ad, #b18e53)",
      spine: "#6e5630",
    },

    {
      base: "#75808a",
      gradient: "linear-gradient(to bottom, #d4d9de, #a7afb8, #75808a)",
      hoverBase: "#8d98a2",
      hoverGradient: "linear-gradient(to bottom, #e7eaee, #d4d9de, #8d98a2)",
      spine: "#4f5962",
    },

    {
      base: "#6f8651",
      gradient: "linear-gradient(to bottom, #cad7bc, #9cb383, #6f8651)",
      hoverBase: "#819967",
      hoverGradient: "linear-gradient(to bottom, #dee6d4, #cad7bc, #819967)",
      spine: "#4e603a",
    },

    {
      base: "#8c7761",
      gradient: "linear-gradient(to bottom, #dfd2c3, #bba58f, #8c7761)",
      hoverBase: "#a28d76",
      hoverGradient: "linear-gradient(to bottom, #ece3d9, #dfd2c3, #a28d76)",
      spine: "#625241",
    },

    {
      base: "#71564e",
      gradient: "linear-gradient(to bottom, #c9b2a7, #9a7b6e, #71564e)",
      hoverBase: "#85665b",
      hoverGradient: "linear-gradient(to bottom, #dccbc2, #c9b2a7, #85665b)",
      spine: "#503d37",
    },

    {
      base: "#6f7f92",
      gradient: "linear-gradient(to bottom, #d1d9e1, #a6b3c1, #6f7f92)",
      hoverBase: "#8596a8",
      hoverGradient: "linear-gradient(to bottom, #e5eaf0, #d1d9e1, #8596a8)",
      spine: "#4d5b6c",
    },

    {
      base: "#4f6580",
      gradient: "linear-gradient(to bottom, #c2cfdd, #8ea3bc, #4f6580)",
      hoverBase: "#667c95",
      hoverGradient: "linear-gradient(to bottom, #d9e0e9, #c2cfdd, #667c95)",
      spine: "#394b61",
    },

    {
      base: "#836f99",
      gradient: "linear-gradient(to bottom, #d9d2e3, #b1a3c4, #836f99)",
      hoverBase: "#9888ab",
      hoverGradient: "linear-gradient(to bottom, #e6e1ed, #d9d2e3, #9888ab)",
      spine: "#5f516f",
    },

    {
      base: "#8a5858",
      gradient: "linear-gradient(to bottom, #ddc2c2, #b58e8e, #8a5858)",
      hoverBase: "#9d6b6b",
      hoverGradient: "linear-gradient(to bottom, #ead8d8, #ddc2c2, #9d6b6b)",
      spine: "#613f3f",
    },

    {
      base: "#7f7771",
      gradient: "linear-gradient(to bottom, #ddd8d4, #b5ada6, #7f7771)",
      hoverBase: "#948b84",
      hoverGradient: "linear-gradient(to bottom, #e8e4e1, #ddd8d4, #948b84)",
      spine: "#5a534d",
    },

    {
      base: "#b8ac9c",
      gradient: "linear-gradient(to bottom, #eee7dd, #d8cbb9, #b8ac9c)",
      hoverBase: "#c8bcae",
      hoverGradient: "linear-gradient(to bottom, #f5f1ea, #eee7dd, #c8bcae)",
      spine: "#897b69",
    },
  ];

  // Generate a consistent palette index based on the recipe book's name. We use a simple hash function that sums the character codes 
  // of the name and mods by the palette length to ensure the same recipe book always gets the same colors.
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
        border-l-[5px]
        book-spine
        flex
        items-center
        justify-center
        overflow-hidden
        transition
        ${onOpen ? "cursor-pointer hover:-translate-y-2 hover:shadow-lg" : ""}
      `}
      style={{
        height: `${heightPx}px`,
        backgroundColor: palette.base,
        ["--book-gradient" as string]: palette.gradient,
        ["--book-gradient-hover" as string]: palette.hoverGradient,
        borderLeftColor: palette.spine,
      }}
    >
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
