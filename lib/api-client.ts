const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  info?: unknown;

  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.info = info;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string>;
  body?: unknown;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, body, ...customConfig } = options;
  
  // Clean endpoint path and auto-prepend /api/v1 if not present
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!cleanEndpoint.startsWith('/api/v1/')) {
    cleanEndpoint = `/api/v1${cleanEndpoint}`;
  }
  
  // Construct URL with query parameters
  const url = new URL(`${BASE_URL}${cleanEndpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, val);
      }
    });
  }

  // Get token from localStorage (client-side only)
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('app-token');
  }

  const defaultHeaders: HeadersInit = {};
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Handle request body serialization
  let serializedBody: BodyInit | null | undefined = undefined;
  if (body) {
    if (body instanceof FormData) {
      serializedBody = body;
    } else {
      defaultHeaders['Content-Type'] = 'application/json';
      serializedBody = JSON.stringify(body);
    }
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: serializedBody,
    ...customConfig,
  };

  try {
    const response = await fetch(url.toString(), config);
    
    // Check for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle unauthorized error globally (clear token if expired/invalid)
      if (response.status === 401 && typeof window !== 'undefined') {
        const isAuthRoute = cleanEndpoint === '/api/v1/auth/login' || cleanEndpoint === '/api/v1/auth/register' || cleanEndpoint === '/api/v1/auth/refresh';
        
        if (!isAuthRoute) {
          const refreshToken = localStorage.getItem('app-refresh-token');
          if (refreshToken) {
            if (!isRefreshing) {
              isRefreshing = true;
              try {
                // Call raw fetch to avoid recursion in the api wrapper
                const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${refreshToken}`,
                  },
                });

                if (refreshRes.ok) {
                  const refreshData = await refreshRes.json();
                  const newAccessToken = refreshData.access_token;
                  localStorage.setItem('app-token', newAccessToken);
                  
                  isRefreshing = false;
                  onRefreshed(newAccessToken);

                  // Retry the original request
                  const retryConfig = {
                    ...options,
                    headers: {
                      ...options.headers,
                      'Authorization': `Bearer ${newAccessToken}`,
                    },
                  };
                  return request<T>(endpoint, retryConfig);
                }
              } catch (refreshErr) {
                console.error('Failed to auto-refresh access token:', refreshErr);
              }

              // If refresh failed, do clean logout
              isRefreshing = false;
              refreshSubscribers = [];
              localStorage.removeItem('app-token');
              localStorage.removeItem('app-refresh-token');
              window.dispatchEvent(new Event('auth-unauthorized'));
            } else {
              // Wait for refresh to complete
              return new Promise<T>((resolve) => {
                subscribeTokenRefresh((newToken: string) => {
                  const retryConfig = {
                    ...options,
                    headers: {
                      ...options.headers,
                      'Authorization': `Bearer ${newToken}`,
                    },
                  };
                  resolve(request<T>(endpoint, retryConfig));
                });
              });
            }
          } else {
            // No refresh token -> logout
            localStorage.removeItem('app-token');
            window.dispatchEvent(new Event('auth-unauthorized'));
          }
        } else {
          // It is an auth route, so 401 means standard failed login / expired session
          if (cleanEndpoint === '/api/v1/auth/refresh') {
            localStorage.removeItem('app-token');
            localStorage.removeItem('app-refresh-token');
            window.dispatchEvent(new Event('auth-unauthorized'));
          }
        }
      }
      
      throw new ApiError(
        data?.detail || response.statusText || 'An error occurred while fetching data.',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(error instanceof Error ? error.message : 'Network connection error');
  }
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'PUT', body }),
    
  patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'PATCH', body }),
    
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
