export type IngredientForm = { id: string | undefined; display_text: string };
export type InstructionForm = { id: string | undefined; description: string };

export type RecipeFormState = {
	name: string;
	description: string;
	servings: string;
	prepMinutes: string;
	cookMinutes: string;
	ingredients: IngredientForm[];
	instructions: InstructionForm[];
};

export type RecipeBookFormState = {
	name: string;
	isPublic: boolean;
	recipeIds: Set<string>;
}