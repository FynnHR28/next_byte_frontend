
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:9000/graphql";

/* 
Generic api request on protected data. JWT handles automatically via cookies, default method is POST
Record is interpreted by TS as an object with keys of type string and values of type string
*/
export const request = async (body:object, method:string="POST", headers:Record<string, string>={}) => {
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
      if (data.errors?.length > 0) {
        throw new Error(data.errors[0].message);
      }
      return data;
    } catch (err:any){
        throw new Error(err)
    }
}
