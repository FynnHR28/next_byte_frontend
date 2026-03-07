import { request } from '@/api_client/api_request'

export async function queryMe(fields:Array<String>) {  
    try {     
        const response = await request({
            query: `
                query getMe {
                    me {
                        ${fields.join(', \n')}
                    }
                }
            `
        })
        return response.data.me
    }
    catch (err){
        throw new Error(`${err}`);
    }
    finally{
        
    }
}