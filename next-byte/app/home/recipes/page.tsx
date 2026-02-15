"use client";

import { request } from "@/api_client/api_request";
import RecipeCard from "@/components/recipes/RecipeCard";
import { useEffect, useMemo, useState } from "react";

export default function Recipes() {
	type IngredientForm = { id: string | undefined; display_text: string };
	type InstructionForm = { id: string | undefined; description: string };
	type FormState = {
		name: string;
		description: string;
		servings: string;
		prepMinutes: string;
		cookMinutes: string;
		ingredients: IngredientForm[];
		instructions: InstructionForm[];
	};

	const [isRecipeCreatorOpen, setIsRecipeCreatorOpen] = useState(false);
	const [step, setStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [serverError, setServerError] = useState("");
	const [recipesError, setRecipesError] = useState("");
	const [recipes, setRecipes] = useState<
		Array<{
			id: string;
			name: string;
			description?: string | null;
			ingredients?: Array<{ id?: string; display_text?: string | null }>;
			instructions?: Array<{ id?: string; position?: number | null; description?: string | null }>;
		}>
	>([]);
	const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [form, setForm] = useState<FormState>({
		name: "",
		description: "",
		servings: "2",
		prepMinutes: "10",
		cookMinutes: "20",
		ingredients: [{ id: undefined, display_text: "" }],
		instructions: [{ id: undefined, description: "" }],
	});
	type TextFieldKey = "name" | "description" | "servings" | "prepMinutes" | "cookMinutes";

	const steps = useMemo(
		() => [
			{ label: "Details" },
			{ label: "Ingredients" },
			{ label: "Steps" },
		],
		[]
	);

	const resetRecipeCreator = () => {
		setStep(0);
		setForm({
			name: "",
			description: "",
			servings: "2",
			prepMinutes: "10",
			cookMinutes: "20",
			ingredients: [{ id: undefined, display_text: "" }],
			instructions: [{ id: undefined, description: "" }],
		});
	};

	const closeRecipeCreator = () => {
		setIsRecipeCreatorOpen(false);
		setEditingRecipeId(null);
		resetRecipeCreator();
	};

	const updateField = (key: TextFieldKey, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	// Add ingredient (adds an empty ingredient to the list for the user to fill out)
	const addIngredient = () => {
		setForm((prev) => ({
			...prev,
			ingredients: [...prev.ingredients, { id: undefined, display_text: "" }],
		}));
	};

	// Update ingredient (updates the display_text of the ingredient at the given index)
	const updateIngredient = (index: number, value: string) => {
		setForm((prev) => ({
			...prev,
			ingredients: prev.ingredients.map((item, idx) =>
				idx === index ? { ...item, display_text: value } : item
			),
		}));
	};

	// Remove ingredient (removes the ingredient at the given index)
	const removeIngredient = (index: number) => {
		setForm((prev) => {
			const nextIngredients = prev.ingredients.filter((_, idx) => idx !== index);
			return {
				...prev,
				ingredients: nextIngredients.length ? nextIngredients : [{ id: undefined, display_text: "" }],
			};
		});
	};

	// Add instruction (adds an empty instruction to the list for the user to fill out)
	const addInstruction = () => {
		setForm((prev) => ({
			...prev,
			instructions: [...prev.instructions, { id: undefined, description: "" }],
		}));
	};

	// Update instruction (updates the description of the instruction at the given index)
	const updateInstruction = (index: number, value: string) => {
		setForm((prev) => ({
			...prev,
			instructions: prev.instructions.map((item, idx) =>
				idx === index ? { ...item, description: value } : item
			),
		}));
	};

	// Remove instruction (removes the instruction at the given index)
	const removeInstruction = (index: number) => {
		setForm((prev) => {
			const nextInstructions = prev.instructions.filter((_, idx) => idx !== index);
			return {
				...prev,
				instructions: nextInstructions.length ? nextInstructions : [{ id: undefined, description: "" }],
			};
		});
	};

	// Load all recipes for the user. ID is derived from the auth token (context.id)
	const loadRecipes = async () => {
		setRecipesError("");
		try {
			const data = await request({
				query: `
					query Recipes {
						recipes {
							id
							name
							description
							ingredients {
								id
								display_text
							}
							instructions {
								id
								position
								description
							}
						}
					}
				`,
			});
			setRecipes(data.data?.recipes ?? []);
		} catch (err) {
			setRecipesError(err instanceof Error ? err.message : "Unable to load recipes.");
		}
	};

	// Open the recipe creator
	const openCreate = () => {
		setServerError("");
		setEditingRecipeId(null);
		resetRecipeCreator();
		setIsRecipeCreatorOpen(true);
	};

	// Open the recipe editor
	const openEdit = async (recipeId: string) => {
		setServerError("");
		setEditingRecipeId(recipeId);
		setStep(0);
		setIsRecipeCreatorOpen(true); // Open recipe creator. Populate it with existing data below. 

		// Pull the recipe to fill out the form
		try {
			const data = await request({
				query: `
					query Recipe($id: ID!) {
						recipe(id: $id) {
							id
							name
							description
							servings
							prep_time
							cook_time
							ingredients {
								id
								display_text
							}
							instructions {
								id
								position
								description
							}
						}
					}
				`,
				variables: { id: recipeId },
			});

			const recipe = data.data?.recipe;
			if (!recipe) return;

			// Create a form populated with the recipe data (or defaults if none exists)
			// While editing, changes will be made to the form state
			setForm({
				name: recipe.name ?? "",
				description: recipe.description ?? "",
				servings: recipe.servings?.toString() ?? "2",
				prepMinutes: recipe.prep_time?.toString() ?? "0",
				cookMinutes: recipe.cook_time?.toString() ?? "0",
				ingredients:
					recipe.ingredients?.length > 0
						? recipe.ingredients.map((item: { id: string; display_text: string }) => ({
								id: item.id,
								display_text: item.display_text ?? "",
							}))
						: [{ id: undefined, display_text: "" }],
				instructions:
					recipe.instructions?.length > 0
						? recipe.instructions.map(
								(item: { id: string; description: string }) => ({
									id: item.id,
									description: item.description ?? "",
								})
						  )
						: [{ id: undefined, description: "" }],
			});
		} catch (err) {
			setServerError(err instanceof Error ? err.message : "Unable to load recipe.");
		}
	};

	const handleDelete = async (recipeId: string) => {
		// Open the "confirm delete" thing
		setPendingDeleteId(recipeId);
	};

	// Actually delete the recipe
	const confirmDelete = async () => {
		if (!pendingDeleteId) return;
		setRecipesError("");
		try {
			await request({
				query: `
					mutation DeleteRecipe($id: ID!) {
						deleteRecipe(recipeId: $id)
					}
				`,
				variables: { id: pendingDeleteId },
			});
			await loadRecipes();
			setPendingDeleteId(null);
		} catch (err) {
			setRecipesError(err instanceof Error ? err.message : "Unable to delete recipe.");
		}
	};

	const cancelDelete = () => {
		setPendingDeleteId(null);
	};

	const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
	const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));
	const progress = Math.round(((step + 1) / steps.length) * 100);

	const handleFinish = async () => {
		const ingredients = form.ingredients
			.map((item) => item.display_text.trim()) // Remove leading/trailing spaces
			.filter(Boolean); // Filter out empty strings

		const instructions = form.instructions
			.map((item) => item.description.trim()) // Remove leading/trailing spaces
			.filter(Boolean); // Filter out empty strings

		const hasIngredients = ingredients.length > 0;
		const hasInstructions = instructions.length > 0;

		// Construct the recipe input object to send to the server
		const recipeInput = {
			name: form.name.trim(),
			description: form.description.trim() || null,
			prep_time: Number(form.prepMinutes) || null,
			cook_time: Number(form.cookMinutes) || null,
			servings: Number(form.servings) || null,

			// Format ingredients and instructions appropriately if they exist
			ingredients: hasIngredients
				? form.ingredients
						.map((item) => ({
							id: item.id,
							display_text: item.display_text.trim(),
						}))
						.filter((item) => item.display_text) // Filter out empty ingredients
				: [],
			instructions: hasInstructions
				? form.instructions
						.map((item, index) => ({
							id: item.id,
							position: index + 1,
							description: item.description.trim(),
						}))
						.filter((item) => item.description) // Filter out empty instructions
				: [],

			is_public: true, // TODO: Allow user to set this
		};

		if (!recipeInput.name) {
			setServerError("Recipe name is required.");
			return;
		}

		setIsSubmitting(true);
		setServerError("");

		try {
			// Call update or create based on whether we're editing or creating
			if (editingRecipeId) {
				await request({
					query: `
						mutation UpdateRecipe($input: updateRecipeInput!) {
							updateRecipe(updateRecipeInput: $input)
						}
					`,
					variables: { input: { id: editingRecipeId, ...recipeInput } },
				});
			} else {
				await request({
					query: `
						mutation CreateRecipe($input: RecipeInput!) {
							createRecipe(recipeInput: $input)
						}
					`,
					variables: { input: recipeInput },
				});
			}
			await loadRecipes();
			closeRecipeCreator();
		} catch (err) {
			setServerError(err instanceof Error ? err.message : "Unable to save recipe.");
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		loadRecipes();
	}, []);

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

			{isRecipeCreatorOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
					<div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white shadow-2xl flex flex-col">
						<div className="border-b border-stone-200 p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xl text-stone-900" style={{ fontFamily: "Georgia" }}>
										{editingRecipeId ? "Edit Recipe" : "Create Recipe"}
									</p>
									<p className="text-sm text-stone-500">
										Step {step + 1} of {steps.length}
									</p>
								</div>
							</div>
							<div className="mt-4 h-2 w-full rounded-full bg-stone-100">
								<div
									className="h-2 rounded-full bg-gradient-to-r from-orange-300 via-amber-300 to-stone-300 transition-all"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<div className="mt-4 flex gap-3 text-xs uppercase tracking-wide text-stone-400">
								{steps.map((item, index) => (
									<span
										key={item.label}
										className={index === step ? "text-stone-700" : ""}
									>
										{item.label}
									</span>
								))}
							</div>
						</div>

						<div className="p-6 space-y-5 overflow-y-auto">
							{step === 0 ? (
								<>
									<label className="block text-sm text-stone-600">
										Recipe Name
										<input
											value={form.name}
											onChange={(event) => updateField("name", event.target.value)}
											placeholder="Citrus Herb Chicken"
											className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900"
										/>
									</label>
									<label className="block text-sm text-stone-600">
										Description
										<textarea
											value={form.description}
											onChange={(event) => updateField("description", event.target.value)}
											placeholder="Bright, zesty, and perfect for weeknights."
											className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900"
											rows={3}
										/>
									</label>

									<div className="grid gap-4 md:grid-cols-3">
										<label className="block text-sm text-stone-600">
											Servings
											<input
												type="number"
												min="1"
												value={form.servings}
												onChange={(event) => updateField("servings", event.target.value)}
												className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900"
											/>
										</label>
										<label className="block text-sm text-stone-600">
											Prep time (minutes)
											<input
												type="number"
												min="0"
												value={form.prepMinutes}
												onChange={(event) => updateField("prepMinutes", event.target.value)}
												className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900"
											/>
										</label>
										<label className="block text-sm text-stone-600">
											Cook time (minutes)
											<input
												type="number"
												min="0"
												value={form.cookMinutes}
												onChange={(event) => updateField("cookMinutes", event.target.value)}
												className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900"
											/>
										</label>
									</div>
								</>
							) : null}

							{step === 1 ? (
								<div className="space-y-4">
									<p className="text-sm text-stone-600">Ingredients</p>
									<div className="space-y-3">
										{form.ingredients.map((ingredient, index) => (
											<div key={`ingredient-${index}`} className="flex gap-3">
												<input
													value={ingredient.display_text}
													onChange={(event) => updateIngredient(index, event.target.value)}
													placeholder="2 chicken thighs"
													className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-stone-900"
												/>
												<button
													className="px-3 py-2 text-sm text-stone-500 hover:text-stone-800"
													onClick={() => removeIngredient(index)}
												>
													Remove
												</button>
											</div>
										))}
									</div>
									<button
										className="text-sm text-stone-700 hover:text-stone-900"
										onClick={addIngredient}
									>
										+ Add ingredient
									</button>
								</div>
							) : null}

							{step === 2 ? (
								<div className="space-y-4">
									<p className="text-sm text-stone-600">Instructions</p>
									<div className="space-y-3">
										{form.instructions.map((instruction, index) => (
											<div key={`instruction-${index}`} className="space-y-2">
												<div className="flex items-center justify-between">
													<p className="text-xs uppercase tracking-wide text-stone-400">
														Step {index + 1}
													</p>
													<button
														className="text-xs text-stone-500 hover:text-stone-800"
														onClick={() => removeInstruction(index)}
													>
														Remove
													</button>
												</div>
												<textarea
													value={instruction.description}
													onChange={(event) => updateInstruction(index, event.target.value)}
													placeholder="Marinate the chicken."
													className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900"
													rows={3}
												/>
											</div>
										))}
									</div>
									<button
										className="text-sm text-stone-700 hover:text-stone-900"
										onClick={addInstruction}
									>
										+ Add step
									</button>
								</div>
							) : null}
						</div>

						<div className="border-t border-stone-200 p-6 space-y-3">
							{serverError ? (
								<p className="text-sm text-red-500">{serverError}</p>
							) : null}
							<div className="flex items-center justify-between">
								<button
									className="text-sm text-stone-500 hover:text-stone-800"
									onClick={closeRecipeCreator}
								>
									Cancel
								</button>
								<div className="flex gap-3">
									<button
										className="px-4 py-2 rounded-full border border-stone-200 text-stone-700 hover:border-stone-300 disabled:opacity-50"
										onClick={prevStep}
										disabled={step === 0 || isSubmitting}
									>
										Back
									</button>
									{step < steps.length - 1 ? (
										<button
											className="px-5 py-2 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800 disabled:opacity-60"
											onClick={nextStep}
											disabled={isSubmitting}
										>
											Next
										</button>
									) : (
										<button
											className="px-5 py-2 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800 disabled:opacity-60"
											onClick={handleFinish}
											disabled={isSubmitting}
										>
											{isSubmitting ? "Saving..." : editingRecipeId ? "Save Changes" : "Create Recipe"}
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			) : null}

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
