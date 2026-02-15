"use client";

import { useState } from "react";

// Various types for recipe data
type Ingredient = {
  id?: string;
  display_text?: string | null;
};

type Instruction = {
  id?: string;
  position?: number | null;
  description?: string | null;
};

type RecipeSummary = {
  id: string;
  name: string;
  description?: string | null;
  updated_at?: string | null;
  ingredients?: Ingredient[];
  instructions?: Instruction[];
};

// Props for RecipeCard component. Ensure that the callbacks take an ID string.
type RecipeCardProps = {
  recipe: RecipeSummary;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

/**
 * RecipeCard component to display a recipe summary with ingredients and instructions checklist
 * 
 * @param recipe Recipe data to display
 * @param onEdit Optional callback to be fired when the edit button is clicked. No edit button shown if not provided.
 * @param onDelete Optional callback to be fired when the delete button is clicked. No delete button shown if not provided.
 * @returns RecipeCard component
 */
const RecipeCard = ({ recipe, onEdit, onDelete }: RecipeCardProps) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    () => new Set()
  );
  const [checkedInstructions, setCheckedInstructions] = useState<Set<string>>(
    () => new Set()
  );

  // Checklist (to mark ingredients/instructions as done)
  const toggleChecked = (
    setFn: React.Dispatch<React.SetStateAction<Set<string>>>,
    key: string
  ) => {
    setFn((prev) => {
      const next = new Set(prev); // Clone to keep state updates immutable
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const ingredients = recipe.ingredients ?? [];
  const instructions = recipe.instructions ?? [];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg text-stone-900" style={{ fontFamily: "Georgia" }}>
            {recipe.name || "Untitled Recipe"}
          </p>
          {recipe.description ? (
            <p className="mt-1 text-sm text-stone-600">{recipe.description}</p>
          ) : null}
        </div>
        {onEdit || onDelete ? (
          <div className="flex items-center gap-3">
            {onEdit ? (
              <button
                className="text-sm text-stone-600 hover:text-stone-900"
                onClick={() => onEdit(recipe.id)}
              >
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button
                className="text-sm text-red-500 hover:text-red-600"
                onClick={() => onDelete(recipe.id)}
              >
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {ingredients.length ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-stone-400">Ingredients</p>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => {
              const key = ingredient.id ?? `ingredient-${index}`;
              const isChecked = checkedIngredients.has(key);
              return (
                <label
                  key={key}
                  className="flex items-center gap-3 text-sm text-stone-700"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleChecked(setCheckedIngredients, key)}
                  />
                  <span className={isChecked ? "line-through text-stone-400" : ""}>
                    {ingredient.display_text || "Unnamed ingredient"}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      {instructions.length ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-stone-400">Instructions</p>
          <div className="space-y-3">
            {instructions.map((instruction, index) => {
              const key = instruction.id ?? `instruction-${index}`;
              const isChecked = checkedInstructions.has(key);
              return (
                <label
                  key={key}
                  className="flex items-start gap-3 text-sm text-stone-700"
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={isChecked}
                    onChange={() => toggleChecked(setCheckedInstructions, key)}
                  />
                  <span className={isChecked ? "line-through text-stone-400" : ""}>
                    {instruction.description || "Instruction"}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RecipeCard;