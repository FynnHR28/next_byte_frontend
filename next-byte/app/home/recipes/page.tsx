"use client";

import { useMemo, useState } from "react";

export default function Recipes() {
	const [isRecipeCreatorOpen, setIsRecipeCreatorOpen] = useState(false);
	const [step, setStep] = useState(0);
	const [form, setForm] = useState({
		name: "",
		description: "",
		servings: "2",
		prepMinutes: "10",
		cookMinutes: "20",
		ingredients: "",
		instructions: "",
	});

	const steps = useMemo(
		() => [
			{ label: "Details"},
			{ label: "Ingredients"},
			{ label: "Steps"},
		],
		[]
	);

	const resetRecipeCreator = () => {
		setStep(0);
		setForm({
			name: "",
			description: "",
			servings: "2",
			prepMinutes: "10",
			cookMinutes: "20",
			ingredients: "",
			instructions: "",
		});
	};

	const closeRecipeCreator = () => {
		setIsRecipeCreatorOpen(false);
		resetRecipeCreator();
	};

	const updateField = (key: keyof typeof form, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
	const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));
	const progress = Math.round(((step + 1) / steps.length) * 100);

	const handleFinish = () => {
		// TODO: Finish backend APIs and connect here
		console.log("Recipe: ", form);
		closeRecipeCreator();
	};

	return (
		<div className="p-10 space-y-8">
			<div className="flex items-center justify-between gap-6">
				<button
					className="px-6 py-3 rounded-full bg-gradient-to-tr from-orange-200 via-amber-100 to-stone-200 text-stone-900 shadow-sm hover:shadow-md hover:scale-[1.01] transition"
					style={{ fontFamily: "Georgia" }}
					onClick={() => setIsRecipeCreatorOpen(true)}
				>
					Create Recipe
				</button>
			</div>

			{isRecipeCreatorOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
					<div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
						<div className="border-b border-stone-200 p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xl text-stone-900" style={{ fontFamily: "Georgia" }}>
										Create Recipe
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
									<span
										key={item.label}
										className={index === step ? "text-stone-700" : ""}
									>
										{item.label}
									</span>
								))}
							</div>
						</div>

						<div className="p-6 space-y-5">
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
								<label className="block text-sm text-stone-600">
									Ingredients (one per line)
									<textarea
										value={form.ingredients}
										onChange={(event) => updateField("ingredients", event.target.value)}
										placeholder={"2 chicken thighs\n1 lemon, zested\n2 tbsp olive oil"}
										className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900"
										rows={6}
									/>
								</label>
							) : null}

							{step === 2 ? (
								<label className="block text-sm text-stone-600">
									Instructions
									<textarea
										value={form.instructions}
										onChange={(event) => updateField("instructions", event.target.value)}
										placeholder={"Marinate the chicken.\nSear until golden.\nFinish in the oven."}
										className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900"
										rows={6}
									/>
								</label>
							) : null}
						</div>

						<div className="flex items-center justify-between border-t border-stone-200 p-6">
							<button
								className="text-sm text-stone-500 hover:text-stone-800"
								onClick={closeRecipeCreator}
							>
								Cancel
							</button>
							<div className="flex gap-3">
								<button
									className="px-4 py-2 rounded-full border border-stone-200 text-stone-700 hover:border-stone-300"
									onClick={prevStep}
									disabled={step === 0}
								>
									Back
								</button>
								{step < steps.length - 1 ? (
									<button
										className="px-5 py-2 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800"
										onClick={nextStep}
									>
										Next
									</button>
								) : (
									<button
										className="px-5 py-2 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800"
										onClick={handleFinish}
									>
										Create Recipe
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
