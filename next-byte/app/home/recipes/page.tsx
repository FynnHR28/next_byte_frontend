"use client";

import { createRecipe, deleteRecipe, type RecipeInput, updateRecipe } from "@/api_client/recipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeCreator from "@/components/recipes/RecipeCreator";
import type { RecipeFormState } from "@/components/recipes/types";
import { useRecipes } from "@/hooks/useRecipes";
import { useMemo, useState } from "react";

export default function RecipesPage() {
  const emptyRecipeForm: RecipeFormState = {
    name: "",
    description: "",
    servings: "2",
    prepMinutes: "10",
    cookMinutes: "20",
    ingredients: [{ id: undefined, display_text: "" }],
    instructions: [{ id: undefined, description: "" }],
  };

  const [isRecipeCreatorOpen, setIsRecipeCreatorOpen] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [pendingDeleteRecipeId, setPendingDeleteRecipeId] = useState<string | null>(null);
  const [initialRecipeForm, setInitialRecipeForm] = useState<RecipeFormState>(emptyRecipeForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipesActionError, setRecipesActionError] = useState("");

  const { recipes, error, loadRecipes } = useRecipes();

  const filteredRecipes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return recipes;
    }

    return recipes.filter((recipe) => {
      const name = (recipe.name ?? "").toLowerCase();
      const description = (recipe.description ?? "").toLowerCase();
      const ingredientText = (recipe.ingredients ?? [])
        .map((ingredient) => ingredient.display_text ?? "")
        .join(" ")
        .toLowerCase();

      return (
        name.includes(query) ||
        description.includes(query) ||
        ingredientText.includes(query)
      );
    });
  }, [recipes, searchQuery]);

  const closeRecipeCreator = () => {
    setIsRecipeCreatorOpen(false);
    setEditingRecipeId(null);
  };

  const openRecipeCreator = () => {
    setEditingRecipeId(null);
    setInitialRecipeForm(emptyRecipeForm);
    setIsRecipeCreatorOpen(true);
  };

  const openRecipeEditor = (recipeId: string) => {
    setEditingRecipeId(recipeId);
    setIsRecipeCreatorOpen(true);

    const recipe = recipes.find((item) => item.id === recipeId);
    if (!recipe) {
      return;
    }

    setInitialRecipeForm({
      name: recipe.name ?? "",
      description: recipe.description ?? "",
      servings: recipe.servings?.toString() ?? "2",
      prepMinutes: recipe.prep_time?.toString() ?? "0",
      cookMinutes: recipe.cook_time?.toString() ?? "0",
      ingredients:
        recipe.ingredients && recipe.ingredients.length > 0
          ? recipe.ingredients.map((item: { id?: string; display_text?: string | null }) => ({
              id: item.id,
              display_text: item.display_text ?? "",
            }))
          : [{ id: undefined, display_text: "" }],
      instructions:
        recipe.instructions && recipe.instructions.length > 0
          ? recipe.instructions.map((item: { id?: string; description?: string | null }) => ({
              id: item.id,
              description: item.description ?? "",
            }))
          : [{ id: undefined, description: "" }],
    });
  };

  const handleDelete = (recipeId: string) => {
    setPendingDeleteRecipeId(recipeId);
  };

  const confirmDeleteRecipe = async () => {
    if (!pendingDeleteRecipeId) return;
    try {
      setRecipesActionError("");
      await deleteRecipe(pendingDeleteRecipeId);
      await loadRecipes();
      setPendingDeleteRecipeId(null);
    } catch (err) {
      setRecipesActionError(err instanceof Error ? err.message : "Unknown error occurred.");
    }
  };

  const cancelDeleteRecipe = () => {
    setPendingDeleteRecipeId(null);
  };

  const handleSaveRecipe = async (recipeInput: RecipeInput) => {
    try {
      if (editingRecipeId) {
        await updateRecipe(editingRecipeId, recipeInput);
      } else {
        await createRecipe(recipeInput);
      }

      await loadRecipes();
    } catch (err) {
      setRecipesActionError(err instanceof Error ? err.message : "Unknown error occurred.");
      throw err;
    }
  };

  return (
    <div className="p-10 space-y-8">
      <div className="flex items-center justify-between gap-6">
        <p className="text-3xl text-stone-900" style={{ fontFamily: "Georgia" }}>
          Recipes
        </p>
        <button
          className="cursor-pointer px-6 py-3 rounded-full bg-gradient-to-tr from-orange-200 via-amber-100 to-stone-200 text-stone-900 shadow-sm hover:shadow-md hover:scale-[1.01] transition"
          style={{ fontFamily: "Georgia" }}
          onClick={openRecipeCreator}
        >
          Create Recipe
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="recipe-search" className="text-sm text-stone-700">
          Search
        </label>
        <input
          id="recipe-search"
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by name, description, or ingredient"
          className="w-full max-w-xl rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {recipesActionError ? <p className="text-sm text-red-500">{recipesActionError}</p> : null}

      {filteredRecipes.length ? (
        <div className="grid gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={openRecipeEditor}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-stone-500">
          {recipes.length ? "No recipes match your search." : "No recipes yet. Create your first recipe."}
        </p>
      )}

      <RecipeCreator
        isOpen={isRecipeCreatorOpen}
        editingRecipeId={editingRecipeId}
        initialForm={initialRecipeForm}
        onClose={closeRecipeCreator}
        onSave={handleSaveRecipe}
      />

      {pendingDeleteRecipeId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <p className="text-lg text-stone-900" style={{ fontFamily: "Georgia" }}>
              Delete this recipe?
            </p>
            <p className="text-sm text-stone-600">
              This action cannot be undone. The recipe and its ingredients will be removed.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 rounded-full border border-stone-200 text-stone-700 hover:border-stone-300"
                onClick={cancelDeleteRecipe}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                onClick={confirmDeleteRecipe}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
