const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Medicines
  static async getMedicines() {
    return this.request('/medicines');
  }

  static async getMedicineById(id) {
    return this.request(`/medicines/${id}`);
  }

  static async createMedicine(medicine) {
    return this.request('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicine),
    });
  }

  static async updateMedicine(id, medicine) {
    return this.request(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicine),
    });
  }

  static async deleteMedicine(id) {
    return this.request(`/medicines/${id}`, {
      method: 'DELETE',
    });
  }

  // Customers
  static async getCustomers() {
    return this.request('/customers');
  }

  static async getCustomerById(id) {
    return this.request(`/customers/${id}`);
  }

  static async createCustomer(customer) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  static async updateCustomer(id, customer) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
  }

  static async deleteCustomer(id) {
    return this.request(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  static async getOrders() {
    return this.request('/orders');
  }

  static async getOrderById(id) {
    return this.request(`/orders/${id}`);
  }

  static async createOrder(order) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  static async updateOrder(id, order) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  }

  static async deleteOrder(id) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Stocks
  static async getStocks() {
    return this.request('/stocks');
  }

  static async getStockById(id) {
    return this.request(`/stocks/${id}`);
  }

  static async getStockByMedicineId(medicineId) {
    return this.request(`/stocks/medicine/${medicineId}`);
  }

  static async createStock(stock) {
    return this.request('/stocks', {
      method: 'POST',
      body: JSON.stringify(stock),
    });
  }

  static async updateStock(id, stock) {
    return this.request(`/stocks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stock),
    });
  }

  static async deleteStock(id) {
    return this.request(`/stocks/${id}`, {
      method: 'DELETE',
    });
  }

  // Invoices
  static async getInvoices() {
    return this.request('/invoices');
  }

  static async getInvoiceById(id) {
    return this.request(`/invoices/${id}`);
  }

  static async createInvoice(invoice) {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  }

  static async updateInvoice(id, invoice) {
    return this.request(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoice),
    });
  }

  static async deleteInvoice(id) {
    return this.request(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  static async getUsers() {
    return this.request('/users');
  }

  static async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  static async createUser(user) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  static async updateUser(id, user) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  static async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export default ApiService;
