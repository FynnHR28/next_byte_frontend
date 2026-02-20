"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchRecipes, Recipe } from "@/api_client/recipes";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesError, setRecipesError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadRecipes = useCallback(async () => {
    setIsLoading(true);
    setRecipesError("");
    try {
      const data = await fetchRecipes();
      setRecipes(data);
    } catch (err) {
      setRecipesError(err instanceof Error ? err.message : "Unable to load recipes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return { recipes, recipesError, isLoading, loadRecipes };
};
