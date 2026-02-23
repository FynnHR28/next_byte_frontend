"use client";

import { useEffect, useMemo, useState } from "react";
import type { RecipeFormState } from "@/components/recipes/types";

type RecipeCreatorProps = {
	isOpen: boolean;
	editingRecipeId: string | null;
	initialForm: RecipeFormState;
	onClose: () => void;
	onSave: (recipeInput: {
		name: string;
		description: string | null;
		prep_time: number | null;
		cook_time: number | null;
		servings: number | null;
		ingredients: Array<{ id?: string; display_text: string }>;
		instructions: Array<{ id?: string; position: number; description: string }>;
		is_public: boolean;
	}) => Promise<void>;
};

/**
 * RecipeCreator component to create or edit a recipe. Uses a multi-step form to collect recipe details, ingredients, and instructions.
 * 
 * @param isOpen Whether the recipe creator is open
 * @param editingRecipeId If editing an existing recipe, the ID of that recipe. Null if creating a new recipe.
 * @param initialForm Initial form state to populate the fields with. Should be empty for creating a new recipe and pre-filled for editing.
 * @param onClose Callback fired when the creator is closed.
 * @param onSave Callback fired with the recipe input data when the user submits the form. Should return a promise that resolves when the save is complete. 
 * @returns 
 */
const RecipeCreator = ({
	isOpen,
	editingRecipeId,
	initialForm,
	onClose,
	onSave,
}: RecipeCreatorProps) => {
	const [step, setStep] = useState(0);
	const [form, setForm] = useState<RecipeFormState>(initialForm);
	const [serverError, setServerError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const steps = useMemo(
		() => [
			{ label: "Details" },
			{ label: "Ingredients" },
			{ label: "Steps" },
		],
		[]
	);
	const progress = Math.round(((step + 1) / steps.length) * 100);

	// Reset wizard state whenever a new recipe is opened.
	useEffect(() => {
		if (!isOpen) return;
		setStep(0);
		setForm(initialForm);
		setServerError("");
	}, [isOpen, initialForm]);

	if (!isOpen) return null;

	const updateField = (
		key: keyof Omit<RecipeFormState, "ingredients" | "instructions">,
		value: string
	) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const addIngredient = () => {
		setForm((prev) => ({
			...prev,
			ingredients: [...prev.ingredients, { id: undefined, display_text: "" }],
		}));
	};

	const updateIngredient = (index: number, value: string) => {
		setForm((prev) => ({
			...prev,
			ingredients: prev.ingredients.map((item, idx) =>
				idx === index ? { ...item, display_text: value } : item
			),
		}));
	};

	const removeIngredient = (index: number) => {
		setForm((prev) => {
			const nextIngredients = prev.ingredients.filter((_, idx) => idx !== index);
			return {
				...prev,
				ingredients: nextIngredients.length ? nextIngredients : [{ id: undefined, display_text: "" }],
			};
		});
	};

	const addInstruction = () => {
		setForm((prev) => ({
			...prev,
			instructions: [...prev.instructions, { id: undefined, description: "" }],
		}));
	};

	const updateInstruction = (index: number, value: string) => {
		setForm((prev) => ({
			...prev,
			instructions: prev.instructions.map((item, idx) =>
				idx === index ? { ...item, description: value } : item
			),
		}));
	};

	const removeInstruction = (index: number) => {
		setForm((prev) => {
			const nextInstructions = prev.instructions.filter((_, idx) => idx !== index);
			return {
				...prev,
				instructions: nextInstructions.length ? nextInstructions : [{ id: undefined, description: "" }],
			};
		});
	};

	const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
	const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

	const handleSubmit = async () => {
		const ingredients = form.ingredients
			.map((item) => item.display_text.trim())
			.filter(Boolean);
		const instructions = form.instructions
			.map((item) => item.description.trim())
			.filter(Boolean);

		const hasIngredients = ingredients.length > 0;
		const hasInstructions = instructions.length > 0;

		const recipeInput = {
			name: form.name.trim(),
			description: form.description.trim() || null,
			prep_time: Number(form.prepMinutes) || null,
			cook_time: Number(form.cookMinutes) || null,
			servings: Number(form.servings) || null,
			ingredients: hasIngredients
				? form.ingredients
						.map((item) => ({
							id: item.id,
							display_text: item.display_text.trim(),
						}))
						.filter((item) => item.display_text)
				: [],
			instructions: hasInstructions
				? form.instructions
						.map((item, index) => ({
							id: item.id,
							position: index + 1,
							description: item.description.trim(),
						}))
						.filter((item) => item.description)
				: [],
			is_public: true,
		};

		if (!recipeInput.name) {
			setServerError("Recipe name is required.");
			return;
		}

		setIsSubmitting(true);
		setServerError("");

		try {
			await onSave(recipeInput);
			onClose();
		} catch (err) {
			setServerError(err instanceof Error ? err.message : "Unable to save recipe.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
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
							<span key={item.label} className={index === step ? "text-stone-700" : ""}>
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
							onClick={onClose}
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
									onClick={handleSubmit}
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
	);
};

export default RecipeCreator;
