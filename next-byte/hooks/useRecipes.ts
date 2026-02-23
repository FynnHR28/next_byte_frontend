"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchRecipes, Recipe, fetchRecipeBooks, fetchRecipesForRecipeBook, RecipeBook } from "@/api_client/recipes";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // TODO: Remove this and store all of them within books instead?
  const [recipeBooks, setRecipeBooks] = useState<RecipeBook[]>([]);
  const [recipeBookRecipes, setRecipeBookRecipes] = useState<Map<string, Recipe[]>>(new Map()); // Map of recipeBookId to recipes in that book
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadRecipes = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const recipes = await fetchRecipes();
      setRecipes(recipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load recipes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRecipeBooks = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const recipeBooks = await fetchRecipeBooks();
      setRecipeBooks(recipeBooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load recipe books.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRecipesForRecipeBook = useCallback(async (recipeBookId: string) => {
    setIsLoading(true);
    setError("");
    try {
      const recipesForBook = await fetchRecipesForRecipeBook(recipeBookId);
      setRecipeBookRecipes((prev) => new Map(prev).set(recipeBookId, recipesForBook));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load recipes for recipe book.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecipes();
    loadRecipeBooks();
  }, [loadRecipes, loadRecipeBooks]);

  return { recipes, recipeBooks, recipeBookRecipes, error, isLoading, loadRecipes, loadRecipeBooks, loadRecipesForRecipeBook };
};