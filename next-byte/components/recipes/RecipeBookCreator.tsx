"use client";

import { useEffect, useMemo, useState } from "react";
import type { RecipeBookFormState } from "@/components/recipes/types";
import type { Recipe } from "@/api_client/recipes";

type RecipeBookCreatorProps = {
	isOpen: boolean;
	editingRecipeBookId: string | null;
	initialForm: RecipeBookFormState;
	recipes: Recipe[];
	onClose: () => void;
	onSave: (recipeBookInput: {
		name: string;
		recipeIds: string[];
		isPublic: boolean;
	}) => Promise<void>;
};

const RecipeBookCreator = ({
	isOpen,
	editingRecipeBookId,
	initialForm,
	recipes,
	onClose,
	onSave,
}: RecipeBookCreatorProps) => {
	const [formState, setFormState] = useState<RecipeBookFormState>(initialForm);

	useEffect(() => {
		if (isOpen) {
			setFormState(initialForm);
		}
	}, [isOpen, initialForm]);

	const isSaveDisabled = useMemo(() => {
		return formState.name.trim() === "";
	}, [formState.name]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormState((prev) => ({ ...prev, [name]: value }));
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setFormState((prev) => ({ ...prev, [name]: checked }));
	};

	const handleRecipeCheckboxChange = (recipeId: string) => {
		setFormState((prev) => {
			const newRecipeIds = new Set(prev.recipeIds);
			if (newRecipeIds.has(recipeId)) {
				newRecipeIds.delete(recipeId);
			} else {
				newRecipeIds.add(recipeId);
			}
			return { ...prev, recipeIds: newRecipeIds };
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSave({
			name: formState.name,
			isPublic: formState.isPublic,
			recipeIds: Array.from(formState.recipeIds),
		});
		onClose();
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
			<div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white shadow-2xl flex flex-col">
				<div className="border-b border-stone-200 p-6">
					<p className="text-xl text-stone-900" style={{ fontFamily: "Georgia" }}>
						{editingRecipeBookId ? "Edit Recipe Book" : "Create Recipe Book"}
					</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col min-h-0">
					<div className="p-6 space-y-5 overflow-y-auto">
						<label htmlFor="name" className="block text-sm text-stone-600">
							Name
							<input
								type="text"
								name="name"
								id="name"
								value={formState.name}
								onChange={handleInputChange}
								className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900"
								placeholder="Simple Recipes"
							/>
						</label>

						<div className="space-y-3">
							<p className="text-sm text-stone-600">Recipes</p>
							<div className="max-h-64 overflow-y-auto p-4 space-y-2">
								{recipes.length > 0 ? recipes.map((recipe) => (
									<label key={recipe.id} className="flex items-center gap-3 text-sm text-stone-700">
										<input
											type="checkbox"
											id={`recipe-${recipe.id}`}
											checked={formState.recipeIds.has(recipe.id)}
											onChange={() => handleRecipeCheckboxChange(recipe.id)}
											className="h-4 w-4 rounded border-stone-300 accent-stone-800"
										/>
										<span>{recipe.name}</span>
									</label>
								)) : (
									<p className="text-sm text-stone-500">No recipes available yet.</p>
								)}
							</div>
						</div>

						<label className="flex items-center gap-3 text-sm text-stone-700">
							<input
								type="checkbox"
								name="isPublic"
								id="isPublic"
								checked={formState.isPublic}
								onChange={handleCheckboxChange}
								className="h-4 w-4 rounded border-stone-300 accent-stone-800"
							/>
							<span>Public</span>
						</label>
					</div>

					<div className="border-t border-stone-200 p-6">
						<div className="flex items-center justify-between">
							<button
								type="button"
								onClick={onClose}
								className="text-sm text-stone-500 hover:text-stone-800"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSaveDisabled}
								className="px-5 py-2 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800 disabled:opacity-60"
							>
								{editingRecipeBookId ? "Save Changes" : "Create"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default RecipeBookCreator;
