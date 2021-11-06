import { getIdToken } from "../login/Firebase";



export function fetchWithAuth(url: string, request: RequestInit) {
    const token = getIdToken();
    return token.then( idToken => {
        if (idToken) {
            return fetch(url, {
                ...request,
                headers: {
                    ...request.headers,
                    'Authorization': `Bearer ${idToken}`
                }
            })
        } else {
            throw Error("User not authenticated")
        }
    })
   
}