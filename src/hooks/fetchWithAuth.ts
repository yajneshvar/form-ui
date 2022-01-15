import { useCallback } from "react";
import { useAsync } from "./useAsyncHook";
import { getIdToken } from "../login/Firebase";


export function useFetchCallbackWithAuth(url: string) {
    const enrichedFetch = useCallback(async () => {
        const token = await getIdToken();
         return (request: RequestInit) => {
            return fetch(url, {
                ...request,
                headers: {
                    ...request.headers,
                    'Authentication': `Bearer ${token}`
                }
            });
        }
    }, [url])
    const { result: fetchWithAuth, error } = useAsync(enrichedFetch)

    return useCallback((request: RequestInit) => {
        if (error) {
            return Promise.reject(error)
        }
        if (fetchWithAuth) {
            return fetchWithAuth(request)
        }
    }, [fetchWithAuth, error]);
}
export function useFetchWithAuth(url: string, request: RequestInit) {
    const enrichedFetch = useCallback(async () => {
        const token = await getIdToken();
        if (token) {
            return await fetch(url, {
                ...request,
                headers: {
                    ...request.headers,
                    'Authorization': `Bearer ${token}`
                }
            });
        } 
        // else {
        //     throw Error("No valid id token");
        // }
    }, [url, request])
    const result = useAsync(enrichedFetch)

    return {
        status: result.status,
        response: result.result,
        error: result.error
    }
}