import config from './config';

function normalizeBaseUrl(url: string): string {
  if (!url) {
    throw new Error('API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL.');
  }
  // Remove trailing slash for consistent joining
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function withTimeout<T>(promise: Promise<T>, ms: number, url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  (promise as any).signal = controller.signal;
  return new Promise<T>((resolve, reject) => {
    promise
      .then((res) => resolve(res))
      .catch((err) => reject(new Error(`Request to ${url} failed: ${err?.message || err}`)))
      .finally(() => clearTimeout(timer));
  });
}

export const apiClient = {
  baseUrl: normalizeBaseUrl(config.apiBaseUrl),
  
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const isFormData = options && options.body instanceof FormData;
    const defaultOptions: RequestInit = isFormData
      ? { headers: { ...options.headers } }
      : {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        };
    try {
      const response = await withTimeout(
        fetch(url, { ...defaultOptions, ...options }),
        15000,
        url
      );
      return response as Response;
    } catch (error) {
      // Surface clearer error to callers
      throw error;
    }
  },
  
  // Convenience methods
  get: (endpoint: string, options?: RequestInit) => 
    apiClient.request(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: any, options?: RequestInit) => {
    const isFormData = data instanceof FormData;
    return apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  },
    
  put: (endpoint: string, data?: any, options?: RequestInit) => {
    const isFormData = data instanceof FormData;
    return apiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  },
    
  delete: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
