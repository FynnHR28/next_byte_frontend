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

export type RecipeBook = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
  user_id?: string;
};

export type RecipeBookInput = {
  name: string;
  isPublic?: boolean;
};

export type RecipeBookSaveInput = RecipeBookInput & {
  recipeIds: string[];
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

/**
 * Gets all recipe books for the signed in user.
 * 
 * @returns A promise that returns an array of RecipeBook objects. If there's an error, it returns an empty array.
 */
export const fetchRecipeBooks = async (): Promise<RecipeBook[]> => {
  const data = await request({
    query: `
      query RecipeBooks {
        recipeBooks {
          id
          name
          created_at
          updated_at
          is_public
          user_id
        }
      }
    `,
  });
  return data.data?.recipeBooks ?? [];
};

/**
 * Gets all of the recipes for a given recipe book.
 * 
 * @param recipeBookId - The ID of the recipe book
 * @returns A promise that returns an array of Recipe objects. If there's an error, it returns an empty array.
 */
export const fetchRecipesForRecipeBook = async (recipeBookId: string): Promise<Recipe[]> => {
  const data = await request({
    query: `
      query RecipesForRecipeBook($id: ID!) {
        recipesForRecipeBook(recipeBookId: $id) {
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
    variables: { id: recipeBookId },
  });
  return data.data?.recipesForRecipeBook ?? [];
}

/**
 * Creates a new recipe book on the server using the provided recipe book input data.
 * 
 * @param recipeBookInput - Input data for the recipe book to be created. Must conform to the RecipeBookInput type.
 */
export const createRecipeBook = async (recipeBookInput: RecipeBookInput): Promise<string> => {
  const data = await request({
    query: `
      mutation CreateRecipeBook($input: recipeBookInput!) {
        createRecipeBook(recipeBookInput: $input)
      }
    `,
    variables: { input: recipeBookInput },
  });
  const createdId = data.data?.createRecipeBook;
  if (!createdId) {
    throw new Error("Unable to create recipe book");
  }
  return createdId;
}

/**
 * Updates an existing recipe book on the server using the provided recipe book ID and input data.
 * 
 * @param id - The ID of the recipe book to update
 * @param recipeBookInput - Input data for the recipe book to be updated. Must conform to the RecipeBookInput type.
 */
export const updateRecipeBook = async (id: string, recipeBookInput: RecipeBookInput) => {
  await request({
    query: `
      mutation UpdateRecipeBook($id: ID!, $input: updateRecipeBookInput!) {
        updateRecipeBook(recipeBookId: $id, recipeBookInput: $input)
      }
    `,
    variables: { id, input: recipeBookInput },
  });
}

export const addRecipesToRecipeBook = async (recipeBookId: string, recipeIds: string[]) => {
  if (recipeIds.length < 1) return;
  await request({
    query: `
      mutation AddRecipesToRecipeBook($recipeBookId: ID!, $recipeIds: [ID!]!) {
        addRecipesToRecipeBook(recipeBookId: $recipeBookId, recipeIds: $recipeIds)
      }
    `,
    variables: { recipeBookId, recipeIds },
  });
}

export const removeRecipesFromRecipeBook = async (recipeBookId: string, recipeIds: string[]) => {
  if (recipeIds.length < 1) return;
  await request({
    query: `
      mutation RemoveRecipesFromRecipeBook($recipeBookId: ID!, $recipeIds: [ID!]!) {
        removeRecipesFromRecipeBook(recipeBookId: $recipeBookId, recipeIds: $recipeIds)
      }
    `,
    variables: { recipeBookId, recipeIds },
  });
}
