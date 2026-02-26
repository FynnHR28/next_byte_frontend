"use client";

import {
	addRecipesToRecipeBook,
	createRecipe,
	createRecipeBook,
	deleteRecipe,
	deleteRecipeBook,
	fetchRecipesForRecipeBook,
	removeRecipesFromRecipeBook,
	RecipeBookInput,
	RecipeBookSaveInput,
	RecipeInput,
	updateRecipe,
	updateRecipeBook
} from "@/api_client/recipes";
import ClosedRecipeBook from "@/components/recipes/ClosedRecipeBook";
import OpenRecipeBook from "@/components/recipes/OpenRecipeBook";
import RecipeCreator from "@/components/recipes/RecipeCreator";
import RecipeBookCreator from "@/components/recipes/RecipeBookCreator";
import type { RecipeFormState, RecipeBookFormState } from "@/components/recipes/types";
import { useRecipes } from "@/hooks/useRecipes";
import { useEffect, useRef, useState } from "react";

export default function Recipes() {
	const [isRecipeCreatorOpen, setIsRecipeCreatorOpen] = useState(false);
	const emptyRecipeForm: RecipeFormState = {
		name: "",
		description: "",
		servings: "2",
		prepMinutes: "10",
		cookMinutes: "20",
		ingredients: [{ id: undefined, display_text: "" }],
		instructions: [{ id: undefined, description: "" }],
	};
	const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
	const [pendingDeleteRecipeId, setPendingDeleteRecipeId] = useState<string | null>(null);
	const [initialRecipeForm, setInitialRecipeForm] = useState<RecipeFormState>(emptyRecipeForm);

	const [isRecipeBookCreatorOpen, setIsRecipeBookCreatorOpen] = useState(false);
	const emptyRecipeBookForm: RecipeBookFormState = {
		name: "",
		isPublic: false,
		recipeIds: new Set<string>(),
	};
	const [editingRecipeBookId, setEditingRecipeBookId] = useState<string | null>(null);
	const [initialRecipeBookForm, setInitialRecipeBookForm] = useState<RecipeBookFormState>(emptyRecipeBookForm);
	const [openRecipeBookId, setOpenRecipeBookId] = useState<string | null>(null);
	const [pendingDeleteRecipeBookId, setPendingDeleteRecipeBookId] = useState<string | null>(null);
	const shelfContainerRef = useRef<HTMLDivElement | null>(null);
	const [booksPerShelf, setBooksPerShelf] = useState(1);
	const bookWidthPx = 48;
	const { recipes, recipeBooks, recipeBookRecipes, error, loadRecipes, loadRecipeBooks, loadRecipesForRecipeBook } = useRecipes();
	const [recipesActionError, setRecipesActionError] = useState("");

	useEffect(() => {
		const container = shelfContainerRef.current;
		if (!container) {
			return;
		}

		const computeBooksPerShelf = () => {
			const nextBooksPerShelf = Math.max(1, Math.floor(container.clientWidth / bookWidthPx));
			setBooksPerShelf(nextBooksPerShelf);
		};

		computeBooksPerShelf();
		const resizeObserver = new ResizeObserver(computeBooksPerShelf);
		resizeObserver.observe(container);
		return () => resizeObserver.disconnect();
	}, [recipeBooks.length]);

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
		setOpenRecipeBookId(null);
		setEditingRecipeId(recipeId);
		setIsRecipeCreatorOpen(true); // Open recipe creator. Populate it with existing data below. 

		const recipe = recipes.find((item) => item.id === recipeId);
		if (!recipe) {
			return;
		}

		// Create a form populated with the recipe data (or defaults if none exists)
		// While editing, changes will be made to the form state
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
					? recipe.instructions.map(
							(item: { id?: string; description?: string | null }) => ({
								id: item.id,
								description: item.description ?? "",
							})
					  )
					: [{ id: undefined, description: "" }],
		});
	};

	const closeRecipeBookCreator = () => {
		setIsRecipeBookCreatorOpen(false);
		setEditingRecipeBookId(null);
	}

	const openRecipeBookCreator = () => {
		setEditingRecipeBookId(null);
		setInitialRecipeBookForm(emptyRecipeBookForm);
		setIsRecipeBookCreatorOpen(true);
	}

	const openRecipeBook = async (recipeBookId: string) => {
		setOpenRecipeBookId(recipeBookId);
		await loadRecipesForRecipeBook(recipeBookId);
	}

	const openRecipeBookEditor = async () => {
		if (!openRecipeBookId) {
			return;
		}

		const bookToEdit = recipeBooks.find((book) => book.id === openRecipeBookId);
		if (!bookToEdit) {
			return;
		}

		const selectedRecipes = await fetchRecipesForRecipeBook(openRecipeBookId);

		setEditingRecipeBookId(openRecipeBookId);
		setInitialRecipeBookForm({
			name: bookToEdit.name ?? "",
			isPublic: Boolean(bookToEdit.is_public),
			recipeIds: new Set(selectedRecipes.map((recipe) => recipe.id)),
		});
		setOpenRecipeBookId(null);
		setIsRecipeBookCreatorOpen(true);
	}

	const closeRecipeBookReader = () => setOpenRecipeBookId(null);
	const handleDeleteRecipeBook = () => {
		if (!openRecipeBookId) {
			return;
		}
		setPendingDeleteRecipeBookId(openRecipeBookId);
	};

	const confirmDeleteRecipeBook = async () => {
		if (!pendingDeleteRecipeBookId) return;
		try {
			setRecipesActionError("");
			await deleteRecipeBook(pendingDeleteRecipeBookId);
			await loadRecipeBooks();
			setOpenRecipeBookId(null);
			setPendingDeleteRecipeBookId(null);
		} catch (err) {
			setRecipesActionError(err instanceof Error ? err.message : "Unknown error occurred.");
		}
	};

	const cancelDeleteRecipeBook = () => {
		setPendingDeleteRecipeBookId(null);
	};

	const openRecipeBookDetails = recipeBooks.find((book) => book.id === openRecipeBookId) ?? null;
	const openRecipeBookRecipes = openRecipeBookId ? (recipeBookRecipes.get(openRecipeBookId) ?? []) : [];
	const fullShelfWidthPx = booksPerShelf * bookWidthPx;
	const recipeBookRows = [];
	for (let index = 0; index < recipeBooks.length; index += booksPerShelf) {
		recipeBookRows.push(recipeBooks.slice(index, index + booksPerShelf));
	}

	const handleSaveRecipeBook = async (recipeBookInput: RecipeBookSaveInput) => {
		// Call update or create based on whether we're editing or creating.
		try {
			const nextRecipeIds = [...new Set(recipeBookInput.recipeIds)];
			const bookPayload: RecipeBookInput = {
				name: recipeBookInput.name,
				isPublic: recipeBookInput.isPublic,
			};

			let recipeBookId: string;
			if (editingRecipeBookId) {
				recipeBookId = editingRecipeBookId;
				await updateRecipeBook(editingRecipeBookId, bookPayload);
			} else {
				recipeBookId = await createRecipeBook(bookPayload);
			}

			const currentRecipes = await fetchRecipesForRecipeBook(recipeBookId);
			const currentRecipeIds = new Set(currentRecipes.map((recipe) => recipe.id));
			const nextRecipeIdSet = new Set(nextRecipeIds);

			const recipeIdsToAdd = nextRecipeIds.filter((id) => !currentRecipeIds.has(id));
			const recipeIdsToRemove = [...currentRecipeIds].filter((id) => !nextRecipeIdSet.has(id));

			if (recipeIdsToAdd.length > 0) {
				await addRecipesToRecipeBook(recipeBookId, recipeIdsToAdd);
			}
			if (recipeIdsToRemove.length > 0) {
				await removeRecipesFromRecipeBook(recipeBookId, recipeIdsToRemove);
			}

			await loadRecipeBooks();
		} catch(err) {
			setRecipesActionError(err instanceof Error ? err.message : "Unknown error occurred.");
			throw err; // Rethrow to let the creator know the action failed. We don't want it to close if there was an error.
		}
	};

	const handleDelete = async (recipeId: string) => {
		// Open the "confirm delete" thing
		setPendingDeleteRecipeId(recipeId);
	};

	// Actually delete the recipe
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
			<div className="flex items-center gap-6">
				<button
					className="cursor-pointer px-6 py-3 rounded-full bg-gradient-to-tr from-orange-200 via-amber-100 to-stone-200 text-stone-900 shadow-sm hover:shadow-md hover:scale-[1.01] transition"
					style={{ fontFamily: "Georgia" }}
					onClick={openRecipeCreator}
				>
					Create Recipe
				</button>
				<button
					className="cursor-pointer px-6 py-3 rounded-full bg-gradient-to-tr from-orange-200 via-amber-100 to-stone-200 text-stone-900 shadow-sm hover:shadow-md hover:scale-[1.01] transition"
					style={{ fontFamily: "Georgia" }}
					onClick={openRecipeBookCreator}
				>
					Create Recipe Book
				</button>
			</div>

			{error ? <p className="text-sm text-red-500">{error}</p> : null}
				{recipesActionError ? (
					<p className="text-sm text-red-500">{recipesActionError}</p>
				) : null}

				{/* Recipe Books */}
				<div className="flex flex-col gap-4">
					<p className="text-xl text-stone-900" style={{ fontFamily: "Georgia" }}>Recipe Books</p>
					{recipeBooks.length ? (
						<div ref={shelfContainerRef} className="flex flex-col gap-5">
							{recipeBookRows.map((row, rowIndex) => (
								<div key={`row-${rowIndex}`} className="inline-flex flex-col self-start" style={{ width: `${fullShelfWidthPx}px` }}>
									<div className="flex items-end">
										{row.map((book) => (
											<div key={book.id}>
												<ClosedRecipeBook
													recipeBook={book}
													onOpen={openRecipeBook}
												/>
											</div>
										))}
									</div>
									<hr className="w-full border-t-5 border-stone-500" />
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-stone-500">No recipe books yet. Create your first recipe book.</p>
					)}
				</div>

			<RecipeCreator
				isOpen={isRecipeCreatorOpen}
				editingRecipeId={editingRecipeId}
				initialForm={initialRecipeForm}
				onClose={closeRecipeCreator}
				onSave={handleSaveRecipe}
			/>

			<OpenRecipeBook
				key={openRecipeBookId ?? "closed-recipe-book"}
				isOpen={Boolean(openRecipeBookId)}
				recipeBookName={openRecipeBookDetails?.name ?? "Recipe Book"}
				recipes={openRecipeBookRecipes}
				onClose={closeRecipeBookReader}
				onEditBook={openRecipeBookEditor}
				onDeleteBook={handleDeleteRecipeBook}
				onEdit={openRecipeEditor}
				onDelete={handleDelete}
			/>

			<RecipeBookCreator
				isOpen={isRecipeBookCreatorOpen}
				recipes={recipes}
				editingRecipeBookId={editingRecipeBookId}
				initialForm={initialRecipeBookForm}
				onClose={closeRecipeBookCreator}
				onSave={handleSaveRecipeBook} // TODO: Implement this and pass it down. It will need to call loadRecipeBooks after saving, and maybe loadRecipesForRecipeBook if we want to immediately show the recipes in the book after creating/editing it. 
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

			{pendingDeleteRecipeBookId ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
						<p className="text-lg text-stone-900" style={{ fontFamily: "Georgia" }}>
							Delete this recipe book?
						</p>
						<p className="text-sm text-stone-600">
							This action cannot be undone. The recipe book will be deleted.
						</p>
						<div className="flex items-center justify-end gap-3">
							<button
								className="px-4 py-2 rounded-full border border-stone-200 text-stone-700 hover:border-stone-300"
								onClick={cancelDeleteRecipeBook}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
								onClick={confirmDeleteRecipeBook}
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
