async function fetchApi(path, options = {}) {
    const basePath = window.location.origin;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // For multipart/form-data, let the browser set the Content-Type
    if (options.body instanceof FormData) delete defaultHeaders['Content-Type'];

    const config = {
      ...options,
      credentials: 'include',
      headers: defaultHeaders
    };

    try {
        const response = await fetch(`${basePath}${path}`, config);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API request failed: ${errorData.message}`);
        }

        // Handle cases where response might be empty (e.g., 204 No Content)
        const contentType = response.headers.get("content-type") || '';

        if (contentType.includes("application/json")) {
            const raw = await response.text();
            try {
                return JSON.parse(raw);
            } catch {
                return raw;
            }
        }

        return await response.text();
    } catch (error) {
        console.error('Fetch API failed:', error.message, 'Code:', error.code, 'Status:', error.status);
        // Re-throw the error, ensuring it has code and status if available
        const processedError = new Error(error.message || 'Falha na requisição.');
        processedError.code = error.code || 'network_error'; // Default if original error has no code
        processedError.status = error.status || 0; // Default if original error has no status
        throw processedError;
    }
}

export const getUsersByPage = (page) => fetchApi(`/user/list?page=${page}`, { method: 'GET' });
export const getUserLogsByDateRange = (page, perpage, start, end) => fetchApi(`/user/register/list?page=${page}&perPage=${perpage}&start_date=${start}&end_date=${end}`, { method: 'GET' });
export const getAdminLogsByDateRange = (page, perpage, start, end) => fetchApi(`/admin/register/list?page=${page}&perPage=${perpage}&start_date=${start}&end_date=${end}`, { method: 'GET' });