"use client";

import { createRecipe, deleteRecipe, RecipeInput, updateRecipe } from "@/api_client/recipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeCreator from "@/components/recipes/RecipeCreator";
import type { FormState } from "@/components/recipes/types";
import { useRecipes } from "@/hooks/useRecipes";
import { useState } from "react";

export default function Recipes() {
	// Recipe state variables and types
	const [isRecipeCreatorOpen, setIsRecipeCreatorOpen] = useState(false);
	const emptyForm: FormState = {
		name: "",
		description: "",
		servings: "2",
		prepMinutes: "10",
		cookMinutes: "20",
		ingredients: [{ id: undefined, display_text: "" }],
		instructions: [{ id: undefined, description: "" }],
	};
	const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [initialForm, setInitialForm] = useState<FormState>(emptyForm);

	const { recipes, recipesError, loadRecipes } = useRecipes();
	const [recipesActionError, setRecipesActionError] = useState("");

	const closeRecipeCreator = () => {
		setIsRecipeCreatorOpen(false);
		setEditingRecipeId(null);
	};

	// Open the recipe creator
	const openCreate = () => {
		setEditingRecipeId(null);
		setInitialForm(emptyForm);
		setIsRecipeCreatorOpen(true);
	};

	// Open the recipe editor
	const openEdit = (recipeId: string) => {
		setEditingRecipeId(recipeId);
		setIsRecipeCreatorOpen(true); // Open recipe creator. Populate it with existing data below. 

		const recipe = recipes.find((item) => item.id === recipeId);
		if (!recipe) {
			return;
		}

		// Create a form populated with the recipe data (or defaults if none exists)
		// While editing, changes will be made to the form state
		setInitialForm({
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
					? recipe.instructions.map(
							(item: { id?: string; description?: string | null }) => ({
								id: item.id,
								description: item.description ?? "",
							})
					  )
					: [{ id: undefined, description: "" }],
		});
	};

	const handleDelete = async (recipeId: string) => {
		// Open the "confirm delete" thing
		setPendingDeleteId(recipeId);
	};

	// Actually delete the recipe
	const confirmDelete = async () => {
		if (!pendingDeleteId) return;
		try {
			setRecipesActionError("");
			await deleteRecipe(pendingDeleteId);
			await loadRecipes();
			setPendingDeleteId(null);
		} catch (err) {
			setRecipesActionError(err instanceof Error ? err.message : "Unknown error occurred.");
		}
	};

	const cancelDelete = () => {
		setPendingDeleteId(null);
	};

	const handleSave = async (recipeInput: RecipeInput) => {
		// Call update or create based on whether we're editing or creating.
		try {
			if (editingRecipeId) {
				await updateRecipe(editingRecipeId, recipeInput);
			} else {
				await createRecipe(recipeInput);
			}

			await loadRecipes();
		} catch(err) {
			setRecipesActionError(err instanceof Error ? err.message : "Unknown error occurred.");
			throw err; // Rethrow to let the creator know the action failed. We don't want it to close if there was an error.
		}
	};

	return (
		<div className="p-10 space-y-8">
			<div className="flex items-center justify-between gap-6">
				<button
					className="px-6 py-3 rounded-full bg-gradient-to-tr from-orange-200 via-amber-100 to-stone-200 text-stone-900 shadow-sm hover:shadow-md hover:scale-[1.01] transition"
					style={{ fontFamily: "Georgia" }}
					onClick={openCreate}
				>
					Create Recipe
				</button>
			</div>

			{recipesError ? <p className="text-sm text-red-500">{recipesError}</p> : null}
			{recipesActionError ? (
				<p className="text-sm text-red-500">{recipesActionError}</p>
			) : null}
			{/* Recipe list */}
			{recipes.length ? (
				<div className="grid gap-4">
					{recipes.map((recipe) => (
						<RecipeCard
							key={recipe.id}
							recipe={recipe}
							// Pass the various callbacks. Since RecipeCard has the ID it will pass it when it calls these. 
							onEdit={openEdit} 
							onDelete={handleDelete} 
						/>
					))}
				</div>
			) : (
				<p className="text-sm text-stone-500">No recipes yet. Create your first recipe.</p>
			)}

			<RecipeCreator
				isOpen={isRecipeCreatorOpen}
				editingRecipeId={editingRecipeId}
				initialForm={initialForm}
				onClose={closeRecipeCreator}
				onSave={handleSave}
			/>

			{pendingDeleteId ? (
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
								onClick={cancelDelete}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
								onClick={confirmDelete}
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
