import { request } from "@/api_client/api_request";

// TODO: Delete won't work yet. We aren't logged in so there's no id in the context. We could delete by email but that seems dangerous.
// maybe the second option should just be "Create New Account With This Email" which reactivates it but deletes all data?

/**
 * Creates a new user account.
 * 
 * @param username - The desired username for the new account.
 * @param password - The desired password for the new account.
 * @param email - The email address for the new account.
 */
export const createUser = async (username: string, password: string, email: string) => {
  await request({
      query: `
        mutation CreateUser($username: String!, $password: String!, $email: String!) {
          createUser(username: $username, password: $password, email: $email) {
            id
          }
        }
      `,
      variables: { username, password, email },
    })
}

/**
 * Logs in a user by sending their credentials to the server. The server will set a JWT in an HttpOnly cookie if the login is successful.
 * 
 * @param email - The email of the user trying to log in.
 * @param password - The password of the user trying to log in.
 */
export const loginUser = async (email: string, password: string) => {
  await request({
      query: `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token,
            user{
              id
            }
          }
        }
      `,
      variables: { email, password },
    })
}

/**
 * Logs out the current user by invalidating their JWT on the server and clearing the cookie.
 */
export const logout = async () => {
  await request({
    query: `
        mutation logout {
          logout 
        }
        `
    })
}