const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }
  return data;
};

const apiService = {
  get: async (url) => {
    const requestOptions = {
      method: 'GET',
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  },
  post: async (url, body) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  },
  put: async (url, body) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  },
  delete: async (url) => {
    const requestOptions = {
      method: 'DELETE',
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  },
};

export default apiService;
