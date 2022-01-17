import { useCallback } from "react";
import { useAsync } from "./useAsyncHook";
import { getIdToken } from "../login/Firebase";


export function useFetchCallbackWithAuth(url: string) {
    const enrichedFetch = useCallback(async () => {
        const token = await getIdToken();
         return (request: RequestInit) => fetch(url, {
                ...request,
                headers: {
                    ...request.headers,
                    'Authentication': `Bearer ${token}`
                }
            })
    }, [url])
    const { result: fetchWithAuth, error } = useAsync(enrichedFetch)

    return useCallback((request: RequestInit) => {
        if (error) {
            return Promise.reject(error)
        }
        if (fetchWithAuth) {
            return fetchWithAuth(request)
        }
        return Promise.resolve({});
    }, [fetchWithAuth, error]);
}
export function useFetchWithAuth(url: string, request: RequestInit) {
    const enrichedFetch = useCallback(async () => {
        const token = await getIdToken();
        if (token) {
            const response = await fetch(url, {
                ...request,
                headers: {
                    ...request.headers,
                    'Authorization': `Bearer ${token}`
                }
            });
            return response;
        }
        return null;
    }, [url, request])
    const result = useAsync(enrichedFetch)

    return {
        status: result.status,
        response: result.result,
        error: result.error
    }
}