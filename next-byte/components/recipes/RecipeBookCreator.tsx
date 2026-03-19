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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 backdrop-blur-[2px] px-4">
			<div className="w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.45)] flex flex-col overflow-hidden border border-[#4b3621]" style={{ backgroundColor: "#efe3c8" }}>
				{/* Header */}
				<div className="border-b border-[#cdb896] px-8 py-6">
					<p className="text-2xl text-stone-800" style={{ fontFamily: "Georgia, serif" }}>
						{editingRecipeBookId ? "Edit Recipe Book" : "Create Recipe Book"}
					</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col min-h-0">
					<div className="px-8 py-6 space-y-6 overflow-y-auto">
						{/* Name Input */}
						<div className="space-y-2">
							<label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-stone-500">
								Name
							</label>
							<input
								type="text"
								name="name"
								id="name"
								value={formState.name}
								onChange={handleInputChange}
								className="w-full rounded-xl border border-[#ccb792] bg-[#f7f0df] px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#a78f77]"
								style={{ fontFamily: "Georgia, serif" }}
								placeholder="My Favorite Recipes"
							/>
						</div>

						{/* Recipes List */}
						<div className="space-y-3">
							<p className="text-xs uppercase tracking-[0.2em] text-stone-500">Recipes</p>
							<div className="max-h-64 overflow-y-auto rounded-xl border border-[#ccb792] bg-[#f7f0df] p-4 space-y-1">
								{recipes.length > 0 ? recipes.map((recipe) => (
									<label
										key={recipe.id}
										className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-[#eadfc7] transition-colors"
									>
										<input
											type="checkbox"
											id={`recipe-${recipe.id}`}
											checked={formState.recipeIds.has(recipe.id)}
											onChange={() => handleRecipeCheckboxChange(recipe.id)}
											className="h-4 w-4 rounded accent-stone-700"
										/>
										<span className="text-sm text-stone-700" style={{ fontFamily: "Georgia, serif" }}>
											{recipe.name}
										</span>
									</label>
								)) : (
									<p className="text-sm text-stone-500 italic py-2">No recipes available yet.</p>
								)}
							</div>
						</div>

						{/* Public Checkbox */}
						<label className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-[#eadfc7] transition-colors w-fit">
							<input
								type="checkbox"
								name="isPublic"
								id="isPublic"
								checked={formState.isPublic}
								onChange={handleCheckboxChange}
								className="h-4 w-4 rounded accent-stone-700"
							/>
							<span className="text-sm text-stone-700" style={{ fontFamily: "Georgia, serif" }}>
								Make this book public
							</span>
						</label>
					</div>

					{/* Footer */}
					<div className="border-t border-[#cdb896] px-8 py-5">
						<div className="flex items-center justify-between">
							<button
								type="button"
								onClick={onClose}
								className="px-5 py-2 rounded-full text-sm text-stone-600 hover:text-stone-800 hover:bg-[#eadfc7] transition-colors"
								style={{ fontFamily: "Georgia, serif" }}
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSaveDisabled}
								className="px-6 py-2.5 rounded-full bg-gradient-to-tr from-orange-200 via-amber-100 to-stone-200 text-stone-900 shadow-sm hover:shadow-md hover:scale-[1.01] transition disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-sm"
								style={{ fontFamily: "Georgia, serif" }}
							>
								{editingRecipeBookId ? "Save Changes" : "Create Book"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default RecipeBookCreator;
