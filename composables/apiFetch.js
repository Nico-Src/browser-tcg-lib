export const apiFetch = async (request, opts) => {
    const config = useRuntimeConfig();
    return useFetch(request, { baseURL: config.public.backend.base_url, server: false, ...opts });
}