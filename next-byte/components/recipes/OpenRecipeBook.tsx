"use client";

import type { Recipe } from "@/api_client/recipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

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
  const clampedIndex = Math.min(Math.max(selectedRecipeIndex, 0), Math.max(recipes.length - 1, 0));
  const activeRecipe = recipes[clampedIndex];
  const canGoBack = clampedIndex > 0;
  const canGoNext = clampedIndex < recipes.length - 1;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm px-4">
      <div className="w-1/2 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xl text-stone-100" style={{ fontFamily: "Georgia" }}>
            {recipeBookName}
          </p>
          <div className="flex items-center gap-2">
            {onEditBook ? (
              <button
                type="button"
                onClick={onEditBook}
                className="cursor-pointer px-4 py-2 rounded-full border border-stone-200/40 text-stone-50 hover:border-stone-200/70 hover:bg-stone-100/10 text-sm"
              >
                Edit Book
              </button>
            ) : null}
            {onDeleteBook ? (
              <button
                type="button"
                onClick={onDeleteBook}
                className="cursor-pointer px-4 py-2 rounded-full border border-red-300/60 text-red-100 hover:border-red-200 hover:bg-red-200/15 text-sm"
              >
                Delete Book
              </button>
            ) : null}
            {!showTableOfContents ? (
              <button
                type="button"
                onClick={() => setShowTableOfContents(true)}
                className="px-4 py-2 rounded-full border border-stone-200/40 text-stone-50 hover:border-stone-200/70 hover:bg-stone-100/10 text-sm"
              >
                Table of Contents
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close book"
              className="cursor-pointer h-8 w-8 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800 flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="max-h-[78vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-amber-50 to-orange-100 p-5 shadow-2xl border border-amber-200/70 space-y-4">
          <div className="flex items-center gap-3">
            <label htmlFor="recipe-book-search" className="text-sm text-stone-700">
              Search
            </label>
            <input
              id="recipe-book-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search title or index"
              className="w-full max-w-md rounded-full border border-amber-300 bg-white/85 px-4 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
            />
          </div>

          {showTableOfContents ? (
            hasRecipes ? (
              tableOfContentsEntries.length ? (
                <div className="grid gap-2">
                  {tableOfContentsEntries.map(({ recipe, index }) => (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => {
                        setSelectedRecipeIndex(index);
                        setShowTableOfContents(false);
                      }}
                      className="cursor-pointer text-left rounded-xl border border-amber-200 bg-white/75 px-4 py-3 hover:border-amber-300 hover:bg-white"
                    >
                      <p className="text-sm text-stone-900">
                        <span className="font-semibold"></span> {recipe.name || "Untitled Recipe"}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-700">No recipes match your search.</p>
              )
            ) : (
              <p className="text-sm text-stone-700">No recipes yet.</p>
            )
          ) : hasRecipes && activeRecipe ? (
            <div className="space-y-4">
              <RecipeCard recipe={activeRecipe} onEdit={onEdit} onDelete={onDelete} />
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRecipeIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={!canGoBack}
                  className="cursor-pointer px-4 py-2 rounded-full border border-stone-300 bg-white text-stone-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-stone-400"
                >
                  <ArrowLeft size={14} />
                </button>
                <p className="text-sm text-stone-700">
                  Recipe {clampedIndex + 1} of {recipes.length}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedRecipeIndex((prev) => Math.min(prev + 1, recipes.length - 1))}
                  disabled={!canGoNext}
                  className="cursor-pointer px-4 py-2 rounded-full border border-stone-300 bg-white text-stone-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-stone-400"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone-700">No recipes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenRecipeBook;
