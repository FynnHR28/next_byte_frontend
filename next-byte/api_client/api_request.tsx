
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:9000/graphql";
const UNAUTHORIZED_MESSAGE = "Unauthorized request on private route (not logged in)";

// To prevent multiple simultaneous refresh token requests, use this variable to track if a refresh is in progress
let refreshInFlight: Promise<void> | null = null;

const parseGraphQLErrorMessage = (data: any): string | null => {
  if (!data?.errors?.length) return null;
  // Return the first error message if it's a string and "Request failed" otherwise
  return typeof data.errors[0]?.message === "string" ? data.errors[0].message : "Request failed";
};

// Run the refresh token mutation to get a new access token. If we get an error, throw it.
const runRefreshToken = async () => {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      query: `
        mutation RefreshToken {
          refreshToken {
            token
            user {
              id
            }
          }
        }
      `,
    }),
  });

  const data = await response.json();
  const message = parseGraphQLErrorMessage(data);
  if (message) throw new Error(message);
};

// Ensure only one refresh token request is in flight at a time
const refreshOnce = async () => {
  // If no refresh is in flight, start one
  if (!refreshInFlight) {
    // Start the refresh token process and store it in the variable. When it completes, clear the variable.
    refreshInFlight = runRefreshToken().finally(() => {
      refreshInFlight = null;
    });
  }
  // Wait for the in-flight refresh to complete
  await refreshInFlight;
};

/* 
Generic api request on protected data. JWT handles automatically via cookies, default method is POST
Record is interpreted by TS as an object with keys of type string and values of type string
*/
export const request = async (
  body: object,
  method: string = "POST",
  headers: Record<string, string> = {},
  hasRetriedAfterRefresh: boolean = false
): Promise<any> => {
    try {
        const response = await fetch(GRAPHQL_URL, {
        method: method,
        credentials: "include",
        headers: { 
            "Content-Type": "application/json",
            //additional headers if necessary
            ...headers
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      const message = parseGraphQLErrorMessage(data);

      if (message) {
        const shouldTryRefresh = !hasRetriedAfterRefresh && message === UNAUTHORIZED_MESSAGE;
        if (shouldTryRefresh) {
          await refreshOnce();
          return request(body, method, headers, true);
        }
        throw new Error(message);
      }
      return data;
    } catch (err:any){
        throw new Error(err)
    }
}
