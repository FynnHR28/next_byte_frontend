import { request } from "@/api_client/api_request";

export type User = {
  username: string;
  created_at: string;
}

/**
 * Recovers an existing user account by activating it.
 * 
 * @param accountEmail - The email of the account to recover
 */
export const recoverExistingAccount = async (accountEmail: string) => {
  await request({
    query: `
      mutation ActivateUser($email: String!) {
        activateUser(email: $email)
      }
    `,	
    variables: { email: accountEmail }
  })
};

/**
 * Deactivates the current user's account. We just set is_active to false to allow the user to recover their account later.
 */
export const deactivateAccount = async () => {
  await request({
    query: `
      mutation DeactivateUser {
        deactivateUser
      }
    `,
  })
}

/**
 * Gets the current logged in user's data. If the user is not logged in, returns null.
 * 
 * @returns A promise that reuturns a User object with the current user's data if the user is logged in, or null if not logged in.
 */
export const getCurrentUser = async () : Promise<User | null> => {
  const response = await request({
    query: `
      query getMe {
        me {
          username,
          created_at
        }
      }
    `
  })
  console.log(response.data.me)
  // Unpack the username and created at fields into the User object
  return response.data.me ? { ...response.data.me } as User : null;
}