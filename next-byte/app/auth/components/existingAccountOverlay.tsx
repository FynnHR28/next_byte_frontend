"use client";

import { request } from "@/api_client/api_request";
import { useRouter } from "next/navigation";

const ExistingAccountOverlay = ({
  email,
  onResolved,
}: {
  email: string;
  onResolved?: () => void;
}) => {
	const router = useRouter(); 

	// TODO: Maybe display errors?
	// TODO: Delete won't work yet. We aren't logged in so there's no id in the context. We could delete by email but that seems dangerous.
	// maybe the second option should just be "Create New Account With This Email" which reactivates it but deletes all data?
	const recoverExistingAccount = async (accountEmail: string) => {
    try {
      await request({
        query: `
          mutation ActivateUser($email: String!) {
            activateUser(email: $email)
          }
        `,	
        variables: { email: accountEmail }
      })
      onResolved?.();
      router.refresh(); 
    } catch (err) {
      console.error(err);
    }
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-80">
				<h2 className="text-xl font-bold mb-4 text-black" style={{ fontFamily: "Georgia" }}>
          An account with this email address was previously deleted. Would you like to recover it?
				</h2>

				<button
					className="bg-gradient-to-tr from-stone-200 to-neutral-300 w-full h-sm rounded-full text-black px-4 py-2 rounded hover:outline hover:outline-3 hover:outline-orange-300 hover:scale-102 ease-in-out"
					style={{ fontFamily: "Georgia" }}
					onClick={() => recoverExistingAccount(email)}
				>
					Recover Existing Account
				</button>
			</div>
		</div>
	);
}   

export default ExistingAccountOverlay;
