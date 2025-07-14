// API client for frontend to backend communication

/**
 * Make authenticated API request
 * @param {string} url 
 * @param {RequestInit} options 
 * @returns {Promise<Response>}
 */
async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response;
}

// Authentication API
export const authAPI = {
  async login(email, password) {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async signup(email, password, name) {
    const response = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  },

  async logout() {
    const response = await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
    return response.json();
  },
};

// Clients API
export const clientsAPI = {
  async getAll() {
    const response = await apiRequest('/api/clients');
    return response.json();
  },

  async getById(id) {
    const response = await apiRequest(`/api/clients/${id}`);
    return response.json();
  },

  async create(clientData) {
    const response = await apiRequest('/api/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
    return response.json();
  },

  async update(id, clientData) {
    const response = await apiRequest(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
    return response.json();
  },

  async delete(id) {
    const response = await apiRequest(`/api/clients/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Payments API
export const paymentsAPI = {
  async getAll() {
    const response = await apiRequest('/api/payments');
    return response.json();
  },

  async create(paymentData) {
    const response = await apiRequest('/api/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  async update(id, paymentData) {
    const response = await apiRequest(`/api/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },
};

// Dashboard API
export const dashboardAPI = {
  async getMetrics() {
    const response = await apiRequest('/api/dashboard');
    return response.json();
  },
};