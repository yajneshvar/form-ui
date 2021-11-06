import { useCallback, useContext, useMemo } from "react";
import { UserContext } from "../providers/UserProvider";
import { useAsync } from "./useAsyncHook";


export function useFetchCallbackWithAuth(url: string) {
    const auth = useContext(UserContext);
    const enrichedFetch = useCallback(async () => {
        const token = await auth?.getIdToken();
         return (request: RequestInit) => {
            return fetch(url, {
                ...request,
                headers: {
                    ...request.headers,
                    'Authentication': `Bearer ${token}`
                }
            });
        }
    }, [auth, url])
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
    const auth = useContext(UserContext);
    const enrichedFetch = useCallback(async () => {
        const token = await auth?.getIdToken();
        if (token) {
            return await fetch(url, {
                ...request,
                headers: {
                    ...request.headers,
                    'Authorization': `Bearer ${token}`
                }
            });
        } else {
            throw Error("No valid id token");
        }
    }, [auth, url, request])
    const result = useAsync(enrichedFetch)

    return {
        status: result.status,
        response: result.result,
        error: result.error
    }
}