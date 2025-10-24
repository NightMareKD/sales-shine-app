// This file provides a clean API for React components to interact with the database
const { ipcRenderer } = window.require('electron');

// Sales API
export const salesAPI = {
    // Add a new sale
    add: async (sale) => {
        try {
            console.log('Adding sale:', sale);
            const result = await ipcRenderer.invoke('add-sale', sale);
            console.log('Sale added:', result);
            return result;
        } catch (error) {
            console.error('Error adding sale:', error);
            throw error;
        }
    },
    
    // Get all sales
    getAll: async () => {
        try {
            console.log('Fetching all sales');
            const result = await ipcRenderer.invoke('get-all-sales');
            console.log('Fetched all sales:', result);
            return result;
        } catch (error) {
            console.error('Error fetching all sales:', error);
            throw error;
        }
    },
    
    // Get single sale by ID
    getById: async (id) => {
        try {
            console.log('Fetching sale by ID:', id);
            const result = await ipcRenderer.invoke('get-sale-by-id', id);
            console.log('Fetched sale:', result);
            return result;
        } catch (error) {
            console.error('Error fetching sale by ID:', error);
            throw error;
        }
    },
    
    // Update a sale
    update: async (id, sale) => {
        try {
            console.log('Updating sale:', id, sale);
            const result = await ipcRenderer.invoke('update-sale', id, sale);
            console.log('Sale updated:', result);
            return result;
        } catch (error) {
            console.error('Error updating sale:', error);
            throw error;
        }
    },
    
    // Delete a sale
    delete: async (id) => {
        try {
            console.log('Deleting sale:', id);
            const result = await ipcRenderer.invoke('delete-sale', id);
            console.log('Sale deleted:', result);
            return result;
        } catch (error) {
            console.error('Error deleting sale:', error);
            throw error;
        }
    },
    
    // Get sales within date range
    getByDateRange: async (startDate, endDate) => {
        try {
            console.log('Fetching sales by date range:', startDate, endDate);
            const result = await ipcRenderer.invoke('get-sales-by-date-range', startDate, endDate);
            console.log('Fetched sales by date range:', result);
            return result;
        } catch (error) {
            console.error('Error fetching sales by date range:', error);
            throw error;
        }
    },
};

// Analytics API
export const analyticsAPI = {
    // Get today's total sales
    getToday: async () => {
        try {
            console.log('Fetching today\'s sales');
            const result = await ipcRenderer.invoke('get-today-sales');
            console.log('Fetched today\'s sales:', result);
            return result;
        } catch (error) {
            console.error('Error fetching today\'s sales:', error);
            throw error;
        }
    },
    
    // Get this week's total sales
    getWeek: async () => {
        try {
            console.log('Fetching this week\'s sales');
            const result = await ipcRenderer.invoke('get-week-sales');
            console.log('Fetched this week\'s sales:', result);
            return result;
        } catch (error) {
            console.error('Error fetching this week\'s sales:', error);
            throw error;
        }
    },
    
    // Get this month's total sales
    getMonth: async () => {
        try {
            console.log('Fetching this month\'s sales');
            const result = await ipcRenderer.invoke('get-month-sales');
            console.log('Fetched this month\'s sales:', result);
            return result;
        } catch (error) {
            console.error('Error fetching this month\'s sales:', error);
            throw error;
        }
    },
    
    // Get top selling items
    getTopItems: async (limit = 5) => {
        try {
            console.log('Fetching top selling items with limit:', limit);
            const result = await ipcRenderer.invoke('get-top-selling-items', limit);
            console.log('Fetched top selling items:', result);
            return result;
        } catch (error) {
            console.error('Error fetching top selling items:', error);
            throw error;
        }
    },
    
    // Get sales breakdown by category
    getByCategory: async () => {
        try {
            console.log('Fetching sales by category');
            const result = await ipcRenderer.invoke('get-sales-by-category');
            console.log('Fetched sales by category:', result);
            return result;
        } catch (error) {
            console.error('Error fetching sales by category:', error);
            throw error;
        }
    },
    
    // Get sales breakdown by payment method
    getByPaymentMethod: async () => {
        try {
            console.log('Fetching sales by payment method');
            const result = await ipcRenderer.invoke('get-sales-by-payment-method');
            console.log('Fetched sales by payment method:', result);
            return result;
        } catch (error) {
            console.error('Error fetching sales by payment method:', error);
            throw error;
        }
    },
};

// Categories API
export const categoriesAPI = {
    // Get all categories
    getAll: async () => {
        try {
            console.log('Fetching all categories');
            const result = await ipcRenderer.invoke('get-all-categories');
            console.log('Fetched all categories:', result);
            return result;
        } catch (error) {
            console.error('Error fetching all categories:', error);
            throw error;
        }
    },
    
    // Add new category
    add: async (name) => {
        try {
            console.log('Adding category:', name);
            const result = await ipcRenderer.invoke('add-category', name);
            console.log('Category added:', result);
            return result;
        } catch (error) {
            console.error('Error adding category:', error);
            throw error;
        }
    },
};