
const GRAPHQL_URL = process.env.GRAPHQL_URL ?? "http://localhost:9000/graphql";
const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY

/* 
Generic api request on protected data. Requires a valid JWT, default method is POST
Record is interpreted by TS as an object with keys of type string and values of type string
*/
export const auth_request = async (body:object, method:string="POST", headers:Record<string, string>={}) => {
    
    // retrieve token if exists
    const token = localStorage.getItem(`${TOKEN_KEY}`)
    
    // if no token exists in local storage, immediately throw error, then redirect to login from the page itself
    if(!token){
        console.log('No token present, redirecting home')
        throw new Error('Unauthorized request, redirecting...')
    }
    console.log('token does exist, requesting data off server')
    // If token exists (regardless of it being expired or not), send request
    try {
        const response = await fetch(GRAPHQL_URL, {
        method: method,
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            //additional headers if necessary
            ...headers
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.errors?.length > 0) {
        throw new Error(data.errors[0].message);
      }
      return data;
    } catch (err:any){
        throw new Error(err)
    }
}

// Generic api request on unprotected data. Default method is POST
export const noauth_request = async (body:object, method:string="POST", headers:Record<string, string>={}) => {
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: method,
            headers: { 
                "Content-Type": "application/json",
                //additional headers if necessary
                ...headers
            },
            body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.errors?.length > 0) {
        throw new Error(data.errors[0].message);
      }
      return data;
    } catch (err:any){
        throw new Error(err)
    }
}