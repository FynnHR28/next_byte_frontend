"use client";

import { request } from "@/api_client/api_request";

export type Recipe = {
  id: string;
  name: string;
  description?: string | null;
  servings?: number | null;
  prep_time?: number | null;
  cook_time?: number | null;
  ingredients?: Array<{ id?: string; display_text?: string | null }>;
  instructions?: Array<{ id?: string; position?: number | null; description?: string | null }>;
};

export type RecipeInput = {
  name: string;
  description: string | null;
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  ingredients: Array<{ id?: string; display_text: string }>;
  instructions: Array<{ id?: string; position: number; description: string }>;
  is_public: boolean;
};

/**
 * Fetches all recipes from the server for the current user (id is sent as part of the request context).
 * 
 * @returns A promise that returns an array of Recipe objects. If there's an error, it returns an empty array.
 */
export const fetchRecipes = async (): Promise<Recipe[]> => {
  const data = await request({
    query: `
      query Recipes {
        recipes {
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
  });
  return data.data?.recipes ?? [];
};

/**
 * Creates a new recipe on the server using the provided recipe input data.
 * 
 * @param recipeInput - The input data for the recipe to be created. Must conform to the RecipeInput type.
 */
export const createRecipe = async (recipeInput: RecipeInput) => {
  await request({
    query: `
      mutation CreateRecipe($input: RecipeInput!) {
        createRecipe(recipeInput: $input)
      }
    `,
    variables: { input: recipeInput },
  });
};

/**
 * Updates an existing recipe on the server using the provided recipe ID and input data.
 * 
 * @param id - The ID of the recipe to be updated.
 * @param recipeInput - The input data for the recipe to be updated. Must conform to the RecipeInput type.
 */
export const updateRecipe = async (id: string, recipeInput: RecipeInput) => {
  await request({
    query: `
      mutation UpdateRecipe($input: updateRecipeInput!) {
        updateRecipe(updateRecipeInput: $input)
      }
    `,
    variables: { input: { id, ...recipeInput } },
  });
};

/**
 * Deletes a recipe from the server using the provided recipe ID.
 * 
 * @param id - The ID of the recipe to be deleted.
 */
export const deleteRecipe = async (id: string) => {
  await request({
    query: `
      mutation DeleteRecipe($id: ID!) {
        deleteRecipe(recipeId: $id)
      }
    `,
    variables: { id },
  });
};
