"use client";

import { useRouter } from "next/navigation";
import { recoverExistingAccount } from "@/api_client/user";

const ExistingAccountOverlay = ({
  email,
  onResolved,
}: {
  email: string;
  onResolved?: () => void;
}) => {
	const router = useRouter(); 

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-80">
				<h2 className="text-xl font-bold mb-4 text-black" style={{ fontFamily: "Georgia" }}>
          An account with this email address was previously deleted. Would you like to recover it?
				</h2>

				<button
					className="bg-gradient-to-tr from-stone-200 to-neutral-300 w-full h-sm rounded-full text-black px-4 py-2 rounded hover:outline hover:outline-3 hover:outline-orange-300 hover:scale-102 ease-in-out"
					style={{ fontFamily: "Georgia" }}
					onClick={async () => {
						try {
							await recoverExistingAccount(email);
							onResolved?.();
							router.refresh();
						} catch (err) {
							console.error(err);
						}
					}}
				>
					Recover Existing Account
				</button>
			</div>
		</div>
	);
}   

export default ExistingAccountOverlay;
