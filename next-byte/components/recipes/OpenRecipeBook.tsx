"use client";

import type { Recipe } from "@/api_client/recipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import { X, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type OpenRecipeBookProps = {
  isOpen: boolean;
  recipeBookName: string;
  recipes: Recipe[];
  onClose: () => void;
  onEditBook?: () => void;
  onDeleteBook?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const OpenRecipeBook = ({
  isOpen,
  recipeBookName,
  recipes,
  onClose,
  onEditBook,
  onDeleteBook,
  onEdit,
  onDelete,
}: OpenRecipeBookProps) => {
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);

  const tableOfContentsEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return recipes
      .map((recipe, index) => ({ recipe, index }))
      .filter(({ recipe }) => {
        if (!query) return true;
        const recipeName = (recipe.name ?? "").toLowerCase();
        return recipeName.includes(query);
      });
  }, [recipes, searchQuery]);

  const hasRecipes = recipes.length > 0;
  const clampedIndex = Math.min(
    Math.max(selectedRecipeIndex, 0),
    Math.max(recipes.length - 1, 0)
  );
  const activeRecipe = recipes[clampedIndex];
  const canGoBack = clampedIndex > 0;
  const canGoNext = clampedIndex < recipes.length - 1;

  useEffect(() => {
    if (isOpen) {
      setShowTableOfContents(true);
      setSearchQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 backdrop-blur-[2px] px-4 py-8">
      <div className="relative w-full max-w-6xl">
        {/* Top bar */}
        <div className="mb-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {onEditBook ? (
              <button
                type="button"
                onClick={onEditBook}
                className="rounded-full border border-stone-300/40 bg-stone-900/50 px-4 py-2 text-sm text-stone-100 hover:bg-stone-900/70"
              >
                Edit Book
              </button>
            ) : null}

            {onDeleteBook ? (
              <button
                type="button"
                onClick={onDeleteBook}
                className="rounded-full border border-red-300/40 bg-red-950/30 px-4 py-2 text-sm text-red-100 hover:bg-red-950/50"
              >
                Delete Book
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close book"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/40 bg-stone-900/70 text-stone-50 hover:bg-stone-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Book */}
        <div className="relative mx-auto h-[78vh] min-h-[620px] w-full overflow-hidden rounded-[18px] border border-[#7b5a3a] bg-[#8b5e3c] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          {/* hard cover shading */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#9b6a45,#7e5435)]" />
          <div className="absolute inset-x-0 top-0 h-5 bg-black/10" />
          <div className="absolute inset-y-0 left-0 w-6 bg-black/12" />
          <div className="absolute inset-y-0 right-0 w-6 bg-white/5" />

          {/* inside book spread */}
          <div className="absolute inset-[18px] rounded-[10px] bg-[#efe3c8] shadow-[inset_0_0_0_1px_rgba(120,90,55,0.35)] overflow-hidden">
            {/* page texture */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(120,90,55,0.18)_0.5px,transparent_0.5px)] [background-size:8px_8px]" />

            {/* left/right page shadows */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(to_right,rgba(0,0,0,0.08),transparent_18%,transparent)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(to_left,rgba(0,0,0,0.06),transparent_18%,transparent)]" />

            {/* center gutter */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[44px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(80,55,35,0.28)_0%,rgba(80,55,35,0.12)_30%,rgba(80,55,35,0.04)_55%,transparent_72%)]" />
            <div className="pointer-events-none absolute inset-y-6 left-1/2 w-px -translate-x-1/2 bg-stone-700/20" />

            <div className="grid h-full grid-cols-2">
              {/* LEFT PAGE */}
              <div className="relative flex h-full min-h-0 flex-col border-r border-[#ccb792] px-8 py-8">
                <div className="mb-4 border-b border-[#cdb896] pb-4">
                  <p
                    className="text-center text-3xl text-stone-800"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {recipeBookName}
                  </p>
                  <p className="mt-2 text-center text-xs uppercase tracking-[0.25em] text-stone-500">
                    Table of Contents
                  </p>
                </div>

                <div className="mb-4 flex items-center gap-3 rounded-full border border-[#ccb792] bg-[#f7f0df] px-4 py-2">
                  <Search size={15} className="text-stone-500" />
                  <input
                    id="recipe-book-search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search recipes"
                    className="w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                  {hasRecipes ? (
                    tableOfContentsEntries.length ? (
                      <div className="space-y-1">
                        {tableOfContentsEntries.map(({ recipe, index }, tocIndex) => (
                          <button
                            key={recipe.id}
                            type="button"
                            onClick={() => {
                              setSelectedRecipeIndex(index);
                              setShowTableOfContents(false);
                            }}
                            className="group flex w-full items-baseline gap-3 rounded-md px-2 py-2 text-left hover:bg-[#eadfc7]"
                          >
                            <span className="w-6 flex-shrink-0 text-sm text-stone-500">
                              {tocIndex + 1}.
                            </span>
                            <span
                              className="flex-1 text-sm text-stone-800 group-hover:text-stone-950"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              {recipe.name || "Untitled Recipe"}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="pt-4 text-sm text-stone-600">
                        No recipes match your search.
                      </p>
                    )
                  ) : (
                    <p className="pt-4 text-sm text-stone-600">No recipes yet.</p>
                  )}
                </div>

                <div className="mt-4 border-t border-[#cdb896] pt-3 text-center text-xs text-stone-500">
                  {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
                </div>
              </div>

              {/* RIGHT PAGE */}
              <div className="relative flex h-full min-h-0 flex-col px-8 py-8">
                <div className="mb-4 flex items-center justify-between border-b border-[#cdb896] pb-4">
                  <div>
                    <p
                      className="text-2xl text-stone-800"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {showTableOfContents
                        ? "Welcome"
                        : activeRecipe?.name || "Recipe"}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">
                      {showTableOfContents
                        ? "Select a recipe to begin"
                        : `Recipe ${clampedIndex + 1} of ${recipes.length}`}
                    </p>
                  </div>

                  {!showTableOfContents ? (
                    <button
                      type="button"
                      onClick={() => setShowTableOfContents(true)}
                      className="rounded-full border border-[#ccb792] bg-[#f7f0df] px-4 py-2 text-sm text-stone-700 hover:bg-[#efe4cd]"
                    >
                      Contents
                    </button>
                  ) : null}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                  {showTableOfContents ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="max-w-md text-center">
                        <p
                          className="mb-3 text-4xl text-stone-700"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          Open to a favorite
                        </p>
                        <p className="text-sm leading-7 text-stone-600">
                          Browse the table of contents on the left page and select
                          a recipe to read. This spread is designed to feel like a
                          real cookbook, with your contents on one page and the
                          selected recipe on the other.
                        </p>
                      </div>
                    </div>
                  ) : hasRecipes && activeRecipe ? (
                    <div className="pb-4">
                      <RecipeCard
                        recipe={activeRecipe}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-stone-600">No recipes yet.</p>
                  )}
                </div>

                {!showTableOfContents && hasRecipes ? (
                  <div className="mt-4 flex items-center justify-between border-t border-[#cdb896] pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRecipeIndex((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={!canGoBack}
                      className="flex items-center gap-2 rounded-full border border-[#ccb792] bg-[#f7f0df] px-4 py-2 text-sm text-stone-700 hover:bg-[#efe4cd] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft size={14} />
                      Previous
                    </button>

                    <div className="text-sm text-stone-500">
                      {clampedIndex + 1} / {recipes.length}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRecipeIndex((prev) =>
                          Math.min(prev + 1, recipes.length - 1)
                        )
                      }
                      disabled={!canGoNext}
                      className="flex items-center gap-2 rounded-full border border-[#ccb792] bg-[#f7f0df] px-4 py-2 text-sm text-stone-700 hover:bg-[#efe4cd] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* page stack hint */}
          <div className="pointer-events-none absolute bottom-2 right-6 h-3 w-28 rounded-sm bg-[#d8c5a3]/70 shadow-[0_1px_0_rgba(255,255,255,0.25)_inset]" />
        </div>
      </div>
    </div>
  );
};

export default OpenRecipeBook;