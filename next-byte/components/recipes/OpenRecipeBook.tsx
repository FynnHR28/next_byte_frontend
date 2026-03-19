"use client";

import type { Recipe } from "@/api_client/recipes";
import { X, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState, useCallback } from "react";

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

const PAPER_COLOR = "#efe3c8";
const FLIP_DURATION = 0.5;

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
  const [searchQuery, setSearchQuery] = useState("");
  // -1 = TOC, 0+ = recipe index
  const [viewIndex, setViewIndex] = useState(-1);
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [prevViewIndex, setPrevViewIndex] = useState(-1);
  const [targetViewIndex, setTargetViewIndex] = useState(-1);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [checkedInstructions, setCheckedInstructions] = useState<Set<string>>(new Set());

  const tableOfContentsEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return recipes
      .map((recipe, index) => ({ recipe, index }))
      .filter(({ recipe }) => {
        if (!query) return true;
        return (recipe.name ?? "").toLowerCase().includes(query);
      });
  }, [recipes, searchQuery]);

  const hasRecipes = recipes.length > 0;
  const activeRecipe = viewIndex >= 0 ? recipes[viewIndex] ?? null : null;
  const prevRecipe = prevViewIndex >= 0 ? recipes[prevViewIndex] ?? null : null;
  const canGoBack = viewIndex > 0;
  const canGoNext = viewIndex >= 0 && viewIndex < recipes.length - 1;

  const navigateTo = useCallback((newIndex: number) => {
    if (newIndex === viewIndex || isFlipping) return;
    const direction = newIndex > viewIndex ? 1 : -1;
    setFlipDirection(direction);
    setPrevViewIndex(viewIndex);
    setTargetViewIndex(newIndex);
    setIsFlipping(true);

    // End flip animation and update content
    setTimeout(() => {
      setViewIndex(newIndex);
      setCheckedIngredients(new Set());
      setCheckedInstructions(new Set());
      setIsFlipping(false);
    }, FLIP_DURATION * 1000);
  }, [viewIndex, isFlipping]);

  const toggleIngredient = (key: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleInstruction = (key: string) => {
    setCheckedInstructions((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setViewIndex(-1);
      setIsFlipping(false);
      setPrevViewIndex(-1);
      setTargetViewIndex(-1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const ingredients = activeRecipe?.ingredients ?? [];
  const instructions = activeRecipe?.instructions ?? [];
  const prevIngredients = prevRecipe?.ingredients ?? [];
  const prevInstructions = prevRecipe?.instructions ?? [];

  // Render TOC left page content
  const renderTocLeft = () => (
    <>
      <div className="mb-4 border-b border-[#cdb896] pb-4">
        <p className="text-center text-3xl text-stone-800" style={{ fontFamily: "Georgia, serif" }}>
          {recipeBookName}
        </p>
        <p className="mt-2 text-center text-xs uppercase tracking-[0.25em] text-stone-500">
          Table of Contents
        </p>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-full border border-[#ccb792] bg-[#f7f0df] px-4 py-2">
        <Search size={15} className="text-stone-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                  onClick={() => navigateTo(index)}
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
            <p className="pt-4 text-sm text-stone-600">No recipes match your search.</p>
          )
        ) : (
          <p className="pt-4 text-sm text-stone-600">No recipes yet.</p>
        )}
      </div>

      <div className="mt-4 border-t border-[#cdb896] pt-3 text-center text-xs text-stone-500">
        {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
      </div>
    </>
  );

  // Render TOC right page content (blank)
  const renderTocRight = () => (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-stone-400 italic" style={{ fontFamily: "Georgia, serif" }}>
        {/* intentionally left blank */}
      </p>
    </div>
  );

  // Render recipe left page (ingredients)
  const renderRecipeLeft = (recipe: Recipe | null, ingredientsList: typeof ingredients) => (
    <>
      <div className="mb-5 border-b border-[#cdb896] pb-4">
        <p className="text-2xl text-stone-800" style={{ fontFamily: "Georgia, serif" }}>
          {recipe?.name || "Recipe"}
        </p>
        {recipe?.description ? (
          <p className="mt-2 text-sm text-stone-600 italic">{recipe.description}</p>
        ) : null}
        {(recipe?.servings || recipe?.prep_time || recipe?.cook_time) ? (
          <div className="mt-3 flex flex-wrap gap-4">
            {recipe.servings ? (
              <span className="text-xs text-stone-500">
                <span className="font-medium text-stone-700">{recipe.servings}</span> servings
              </span>
            ) : null}
            {recipe.prep_time ? (
              <span className="text-xs text-stone-500">
                Prep <span className="font-medium text-stone-700">{recipe.prep_time}</span> min
              </span>
            ) : null}
            {recipe.cook_time ? (
              <span className="text-xs text-stone-500">
                Cook <span className="font-medium text-stone-700">{recipe.cook_time}</span> min
              </span>
            ) : null}
          </div>
        ) : null}
        {(onEdit || onDelete) && recipe ? (
          <div className="mt-3 flex gap-3">
            {onEdit ? (
              <button
                type="button"
                onClick={() => onEdit(recipe.id)}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(recipe.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">Ingredients</p>
      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        {ingredientsList.length ? (
          <div className="space-y-2">
            {ingredientsList.map((ingredient, i) => {
              const key = ingredient.id ?? `ing-${i}`;
              const checked = checkedIngredients.has(key);
              return (
                <label
                  key={key}
                  className="flex cursor-pointer items-start gap-3 rounded px-1 py-1 hover:bg-[#eadfc7]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleIngredient(key)}
                    className="mt-0.5 accent-stone-600"
                  />
                  <span
                    className={`text-sm ${checked ? "text-stone-400 line-through" : "text-stone-700"}`}
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {ingredient.display_text || "Unnamed ingredient"}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-stone-500">No ingredients.</p>
        )}
      </div>
    </>
  );

  // Render recipe right page (instructions)
  const renderRecipeRight = (recipe: Recipe | null, instructionsList: typeof instructions, recipeIndex: number) => (
    <>
      <div className="mb-5 border-b border-[#cdb896] pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Instructions</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        {instructionsList.length ? (
          <div className="space-y-4">
            {instructionsList
              .slice()
              .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
              .map((instruction, i) => {
                const key = instruction.id ?? `ins-${i}`;
                const checked = checkedInstructions.has(key);
                return (
                  <label
                    key={key}
                    className="flex cursor-pointer items-start gap-3 rounded px-1 py-1 hover:bg-[#eadfc7]"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleInstruction(key)}
                        className="accent-stone-600"
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <span
                        className="flex-shrink-0 text-sm font-medium text-stone-400"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {i + 1}.
                      </span>
                      <span
                        className={`text-sm leading-relaxed ${checked ? "text-stone-400 line-through" : "text-stone-700"}`}
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {instruction.description || ""}
                      </span>
                    </div>
                  </label>
                );
              })}
          </div>
        ) : (
          <p className="text-sm text-stone-500">No instructions.</p>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-between border-t border-[#cdb896] pt-4">
        <button
          type="button"
          onClick={() => navigateTo(recipeIndex > 0 ? recipeIndex - 1 : -1)}
          disabled={isFlipping}
          className="flex items-center gap-2 rounded-full border border-[#ccb792] bg-[#f7f0df] px-4 py-2 text-sm text-stone-700 hover:bg-[#efe4cd] disabled:opacity-50"
        >
          <ArrowLeft size={14} />
          {recipeIndex > 0 ? "Previous" : "Contents"}
        </button>

        <div className="text-sm text-stone-500">
          {recipeIndex + 1} / {recipes.length}
        </div>

        <button
          type="button"
          onClick={() => navigateTo(recipeIndex + 1)}
          disabled={isFlipping || recipeIndex >= recipes.length - 1}
          className="flex items-center gap-2 rounded-full border border-[#ccb792] bg-[#f7f0df] px-4 py-2 text-sm text-stone-700 hover:bg-[#efe4cd] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ArrowRight size={14} />
        </button>
      </div>
    </>
  );

  // Get content for a specific view index
  const getLeftContent = (index: number) => {
    if (index === -1) return renderTocLeft();
    const recipe = recipes[index] ?? null;
    return renderRecipeLeft(recipe, recipe?.ingredients ?? []);
  };

  const getRightContent = (index: number) => {
    if (index === -1) return renderTocRight();
    const recipe = recipes[index] ?? null;
    return renderRecipeRight(recipe, recipe?.instructions ?? [], index);
  };

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
        <div className="relative mx-auto h-[78vh] min-h-[620px] w-full overflow-hidden rounded-[10px] border border-[#4b3621] bg-[#7f6244] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          {/* Stacked page edges */}
          <div className="absolute top-[18px] bottom-[18px] left-[15px] right-[15px] rounded-[10px] bg-[#efe3c8] shadow-[inset_0_0_0_0.5px_rgba(120,90,55,0.35)] overflow-hidden" />
          <div className="absolute top-[18px] bottom-[18px] left-[16px] right-[16px] rounded-[10px] bg-[#efe3c8] shadow-[inset_0_0_0_0.5px_rgba(120,90,55,0.35)] overflow-hidden" />
          <div className="absolute top-[18px] bottom-[18px] left-[17px] right-[17px] rounded-[10px] bg-[#efe3c8] shadow-[inset_0_0_0_0.5px_rgba(120,90,55,0.35)] overflow-hidden" />

          <div className="absolute inset-[18px] rounded-[10px] bg-[#efe3c8] shadow-[inset_0_0_0_1px_rgba(120,90,55,0.35)] overflow-hidden">
            {/* Spine shadow - z-10 to render above page backgrounds */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[44px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(80,55,35,0.28)_0%,rgba(80,55,35,0.12)_30%,rgba(80,55,35,0.04)_55%,transparent_80%)]" />
            <div className="pointer-events-none absolute inset-y-6 left-1/2 z-10 w-px -translate-x-1/2 bg-stone-700/20" />

            <div className="relative grid h-full grid-cols-2" style={{ perspective: "1800px" }}>

              {/* ── LEFT PAGE (static base) ── */}
              <div
                className="relative h-full flex flex-col px-8 py-8 overflow-hidden"
                style={{ backgroundColor: PAPER_COLOR }}
              >
                {/* Forward: left is covered (old), Backward: left is revealed (new) */}
                {getLeftContent(
                  isFlipping
                    ? (flipDirection === 1 ? prevViewIndex : targetViewIndex)
                    : viewIndex
                )}
              </div>

              {/* ── RIGHT PAGE (static base) ── */}
              <div
                className="relative h-full flex flex-col px-8 py-8 overflow-hidden"
                style={{ backgroundColor: PAPER_COLOR }}
              >
                {/* Forward: right is revealed (new), Backward: right is covered (old) */}
                {getRightContent(
                  isFlipping
                    ? (flipDirection === 1 ? targetViewIndex : prevViewIndex)
                    : viewIndex
                )}
              </div>

              {/* ── FLIPPING PAGE OVERLAY ── */}
              {isFlipping && (
                <div
                  className="pointer-events-none absolute inset-0 z-20 grid grid-cols-2"
                  style={{ perspective: "1800px" }}
                >
                  {/* Forward flip: right page flips to left */}
                  {flipDirection === 1 && (
                    <div className="col-start-2 relative h-full" style={{ transformStyle: "preserve-3d" }}>
                      <motion.div
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: -180 }}
                        transition={{ duration: FLIP_DURATION, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          transformStyle: "preserve-3d",
                          transformOrigin: "left center",
                        }}
                      >
                        {/* Front face: old right page content */}
                        <div
                          className="absolute inset-0 flex flex-col px-8 py-8 overflow-hidden"
                          style={{
                            backgroundColor: PAPER_COLOR,
                            backfaceVisibility: "hidden",
                          }}
                        >
                          {getRightContent(prevViewIndex)}
                        </div>
                        {/* Back face: new left page content */}
                        <div
                          className="absolute inset-0 flex flex-col px-8 py-8 overflow-hidden"
                          style={{
                            backgroundColor: PAPER_COLOR,
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          {getLeftContent(targetViewIndex)}
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Backward flip: left page flips to right */}
                  {flipDirection === -1 && (
                    <div className="col-start-1 relative h-full" style={{ transformStyle: "preserve-3d" }}>
                      <motion.div
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: 180 }}
                        transition={{ duration: FLIP_DURATION, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          transformStyle: "preserve-3d",
                          transformOrigin: "right center",
                        }}
                      >
                        {/* Front face: old left page content */}
                        <div
                          className="absolute inset-0 flex flex-col px-8 py-8 overflow-hidden"
                          style={{
                            backgroundColor: PAPER_COLOR,
                            backfaceVisibility: "hidden",
                          }}
                        >
                          {getLeftContent(prevViewIndex)}
                        </div>
                        {/* Back face: new right page content */}
                        <div
                          className="absolute inset-0 flex flex-col px-8 py-8 overflow-hidden"
                          style={{
                            backgroundColor: PAPER_COLOR,
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          {getRightContent(targetViewIndex)}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenRecipeBook;
