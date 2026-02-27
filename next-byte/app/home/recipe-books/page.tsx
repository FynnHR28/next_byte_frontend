"use client";

import {
  addRecipesToRecipeBook,
  createRecipe,
  createRecipeBook,
  deleteRecipeBook,
  fetchRecipesForRecipeBook,
  removeRecipesFromRecipeBook,
  type RecipeInput,
  type RecipeBookInput,
  type RecipeBookSaveInput,
  updateRecipe,
  updateRecipeBook,
} from "@/api_client/recipes";
import ClosedRecipeBook from "@/components/recipes/ClosedRecipeBook";
import OpenRecipeBook from "@/components/recipes/OpenRecipeBook";
import RecipeCreator from "@/components/recipes/RecipeCreator";
import RecipeBookCreator from "@/components/recipes/RecipeBookCreator";
import type { RecipeBookFormState, RecipeFormState } from "@/components/recipes/types";
import { useRecipes } from "@/hooks/useRecipes";
import { useEffect, useRef, useState } from "react";

export default function RecipeBooksPage() {
  const emptyRecipeForm: RecipeFormState = {
    name: "",
    description: "",
    servings: "2",
    prepMinutes: "10",
    cookMinutes: "20",
    ingredients: [{ id: undefined, display_text: "" }],
    instructions: [{ id: undefined, description: "" }],
  };
  const emptyRecipeBookForm: RecipeBookFormState = {
    name: "",
    isPublic: false,
    recipeIds: new Set<string>(),
  };

  const [isRecipeCreatorOpen, setIsRecipeCreatorOpen] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [initialRecipeForm, setInitialRecipeForm] = useState<RecipeFormState>(emptyRecipeForm);
  const [bookIdBeingEditedFrom, setBookIdBeingEditedFrom] = useState<string | null>(null);
  const [isRecipeBookCreatorOpen, setIsRecipeBookCreatorOpen] = useState(false);
  const [editingRecipeBookId, setEditingRecipeBookId] = useState<string | null>(null);
  const [initialRecipeBookForm, setInitialRecipeBookForm] =
    useState<RecipeBookFormState>(emptyRecipeBookForm);
  const [openRecipeBookId, setOpenRecipeBookId] = useState<string | null>(null);
  const [pendingDeleteRecipeBookId, setPendingDeleteRecipeBookId] = useState<string | null>(null);
  const [recipesActionError, setRecipesActionError] = useState("");

  const shelfContainerRef = useRef<HTMLDivElement | null>(null);
  const [booksPerShelf, setBooksPerShelf] = useState(1);
  const bookWidthPx = 48;

  const {
    recipes,
    recipeBooks,
    recipeBookRecipes,
    error,
    loadRecipes,
    loadRecipeBooks,
    loadRecipesForRecipeBook,
  } = useRecipes();

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

  const closeRecipeBookCreator = () => {
    setIsRecipeBookCreatorOpen(false);
    setEditingRecipeBookId(null);
  };

  const closeRecipeCreator = () => {
    setIsRecipeCreatorOpen(false);
    setEditingRecipeId(null);
    setBookIdBeingEditedFrom(null);
  };

  const openRecipeEditor = (recipeId: string) => {
    const sourceBookId = openRecipeBookId;
    setBookIdBeingEditedFrom(sourceBookId);
    setOpenRecipeBookId(null);
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

  const openRecipeBookCreator = () => {
    setEditingRecipeBookId(null);
    setInitialRecipeBookForm(emptyRecipeBookForm);
    setIsRecipeBookCreatorOpen(true);
  };

  const openRecipeBook = async (recipeBookId: string) => {
    setOpenRecipeBookId(recipeBookId);
    await loadRecipesForRecipeBook(recipeBookId);
  };

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
  };

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

  const handleSaveRecipeBook = async (recipeBookInput: RecipeBookSaveInput) => {
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
      await loadRecipesForRecipeBook(recipeBookId);
    } catch (err) {
      setRecipesActionError(err instanceof Error ? err.message : "Unknown error occurred.");
      throw err;
    }
  };

  const handleSaveRecipe = async (recipeInput: RecipeInput) => {
    try {
      if (editingRecipeId) {
        await updateRecipe(editingRecipeId, recipeInput);
      } else {
        await createRecipe(recipeInput);
      }

      await loadRecipes();
      const sourceBookId = bookIdBeingEditedFrom ?? openRecipeBookId;
      if (sourceBookId) {
        await loadRecipesForRecipeBook(sourceBookId);
      }
    } catch (err) {
      setRecipesActionError(err instanceof Error ? err.message : "Unknown error occurred.");
      throw err;
    }
  };

  const openRecipeBookDetails = recipeBooks.find((book) => book.id === openRecipeBookId) ?? null;
  const openRecipeBookRecipes = openRecipeBookId
    ? recipeBookRecipes.get(openRecipeBookId) ?? []
    : [];
  const fullShelfWidthPx = booksPerShelf * bookWidthPx;
  const recipeBookRows = [];
  for (let index = 0; index < recipeBooks.length; index += booksPerShelf) {
    recipeBookRows.push(recipeBooks.slice(index, index + booksPerShelf));
  }

  return (
    <div className="p-10 space-y-8">
      <div className="flex items-center justify-between gap-6">
        <p className="text-3xl text-stone-900" style={{ fontFamily: "Georgia" }}>
          Recipe Books
        </p>
        <button
          className="cursor-pointer px-6 py-3 rounded-full bg-gradient-to-tr from-orange-200 via-amber-100 to-stone-200 text-stone-900 shadow-sm hover:shadow-md hover:scale-[1.01] transition"
          style={{ fontFamily: "Georgia" }}
          onClick={openRecipeBookCreator}
        >
          Create Recipe Book
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {recipesActionError ? <p className="text-sm text-red-500">{recipesActionError}</p> : null}

      {recipeBooks.length ? (
        <div ref={shelfContainerRef} className="flex flex-col gap-5">
          {recipeBookRows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="inline-flex flex-col self-start"
              style={{ width: `${fullShelfWidthPx}px` }}
            >
              <div className="flex items-end">
                {row.map((book) => (
                  <div key={book.id}>
                    <ClosedRecipeBook recipeBook={book} onOpen={openRecipeBook} />
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

      <OpenRecipeBook
        key={openRecipeBookId ?? "closed-recipe-book"}
        isOpen={Boolean(openRecipeBookId)}
        recipeBookName={openRecipeBookDetails?.name ?? "Recipe Book"}
        recipes={openRecipeBookRecipes}
        onClose={closeRecipeBookReader}
        onEditBook={openRecipeBookEditor}
        onDeleteBook={handleDeleteRecipeBook}
        onEdit={openRecipeEditor}
      />

      <RecipeCreator
        isOpen={isRecipeCreatorOpen}
        editingRecipeId={editingRecipeId}
        initialForm={initialRecipeForm}
        onClose={closeRecipeCreator}
        onSave={handleSaveRecipe}
      />

      <RecipeBookCreator
        isOpen={isRecipeBookCreatorOpen}
        recipes={recipes}
        editingRecipeBookId={editingRecipeBookId}
        initialForm={initialRecipeBookForm}
        onClose={closeRecipeBookCreator}
        onSave={handleSaveRecipeBook}
      />

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
                className="cursor-pointer px-4 py-2 rounded-full border border-stone-200 text-stone-700 hover:border-stone-300"
                onClick={cancelDeleteRecipeBook}
              >
                Cancel
              </button>
              <button
                className="cursor-pointer px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
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
