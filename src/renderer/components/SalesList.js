import React, { useState, useEffect } from 'react';
import { salesAPI } from '../api';
import SaleForm from './SaleForm';
import './SalesList.css';

function SalesList({ onDataChange }) {
    // State management
    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPayment, setFilterPayment] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    
    // Edit mode
    const [editingSale, setEditingSale] = useState(null);
    
    // Unique categories and payment methods for filters
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    // Load sales when component mounts
    useEffect(() => {
        loadSales();
    }, []);

    // Apply filters whenever they change
    useEffect(() => {
        applyFilters();
    }, [sales, searchTerm, filterCategory, filterPayment, dateFrom, dateTo]);

    // Load all sales from database
    const loadSales = async () => {
        try {
            setLoading(true);
            const data = await salesAPI.getAll();
            setSales(data);
            
            // Extract unique categories and payment methods
            const uniqueCategories = [...new Set(data.map(s => s.category))];
            const uniquePayments = [...new Set(data.map(s => s.payment_method))];
            setCategories(uniqueCategories);
            setPaymentMethods(uniquePayments);
            
        } catch (error) {
            console.error('Error loading sales:', error);
            alert('Failed to load sales');
        } finally {
            setLoading(false);
        }
    };

    // Apply all filters to sales list
    const applyFilters = () => {
        let filtered = [...sales];

        // Search filter (item name or customer name)
        if (searchTerm) {
            filtered = filtered.filter(sale => 
                sale.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (sale.customer_name && sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (filterCategory) {
            filtered = filtered.filter(sale => sale.category === filterCategory);
        }

        // Payment method filter
        if (filterPayment) {
            filtered = filtered.filter(sale => sale.payment_method === filterPayment);
        }

        // Date range filter
        if (dateFrom) {
            filtered = filtered.filter(sale => sale.date >= dateFrom);
        }
        if (dateTo) {
            filtered = filtered.filter(sale => sale.date <= dateTo);
        }

        setFilteredSales(filtered);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterPayment('');
        setDateFrom('');
        setDateTo('');
    };

    // Delete a sale
    const handleDelete = async (id, itemName) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${itemName}"?\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            await salesAPI.delete(id);
            alert('Sale deleted successfully!');
            loadSales(); // Reload the list
            onDataChange(); // Notify parent to refresh dashboard
        } catch (error) {
            console.error('Error deleting sale:', error);
            alert('Failed to delete sale');
        }
    };

    // Start editing a sale
    const handleEdit = (sale) => {
        setEditingSale(sale);
    };

    // Handle successful edit
    const handleEditSave = () => {
        setEditingSale(null);
        loadSales();
        onDataChange();
    };

    // Cancel editing
    const handleEditCancel = () => {
        setEditingSale(null);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate totals for filtered sales
    const calculateTotals = () => {
        const total = filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0);
        const count = filteredSales.length;
        const avgSale = count > 0 ? total / count : 0;

        return { total, count, avgSale };
    };

    const totals = calculateTotals();

    // If editing, show the edit form
    if (editingSale) {
        return (
            <SaleForm 
                editSale={editingSale}
                onSave={handleEditSave}
                onCancel={handleEditCancel}
            />
        );
    }

    // Show loading state
    if (loading) {
        return (
            <div className="loading">
                <h2>Loading sales...</h2>
            </div>
        );
    }

    return (
        <div className="sales-list-container">
            {/* Header with Summary */}
            <div className="sales-header">
                <div>
                    <h1>All Sales</h1>
                    <p>View, search, and manage all your sales transactions</p>
                </div>
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="summary-label">Total Sales</div>
                        <div className="summary-value">{totals.count}</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-label">Total Revenue</div>
                        <div className="summary-value">{formatCurrency(totals.total)}</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-label">Avg Sale</div>
                        <div className="summary-value">{formatCurrency(totals.avgSale)}</div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="card filters-card">
                <h3>🔍 Search & Filter</h3>
                
                <div className="filters-grid">
                    {/* Search Box */}
                    <div className="filter-group">
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Search by item or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="filter-group">
                        <label>Category</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Filter */}
                    <div className="filter-group">
                        <label>Payment Method</label>
                        <select
                            value={filterPayment}
                            onChange={(e) => setFilterPayment(e.target.value)}
                        >
                            <option value="">All Methods</option>
                            {paymentMethods.map(method => (
                                <option key={method} value={method}>{method}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div className="filter-group">
                        <label>From Date</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </div>

                    {/* Date To */}
                    <div className="filter-group">
                        <label>To Date</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>

                    {/* Clear Filters Button */}
                    <div className="filter-group">
                        <label>&nbsp;</label>
                        <button 
                            className="btn btn-secondary"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="results-info">
                    Showing {filteredSales.length} of {sales.length} sales
                </div>
            </div>

            {/* Sales Table */}
            <div className="card">
                {filteredSales.length === 0 ? (
                    <div className="empty-state">
                        <h3>No sales found</h3>
                        <p>
                            {sales.length === 0 
                                ? "You haven't added any sales yet." 
                                : "Try adjusting your filters."}
                        </p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Item</th>
                                    <th>Category</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Customer</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSales.map((sale) => (
                                    <tr key={sale.id}>
                                        <td>{formatDate(sale.date)}</td>
                                        <td className="item-name">{sale.item_name}</td>
                                        <td>
                                            <span className="category-badge">
                                                {sale.category}
                                            </span>
                                        </td>
                                        <td>{sale.quantity}</td>
                                        <td>{formatCurrency(sale.unit_price)}</td>
                                        <td className="total-amount">
                                            {formatCurrency(sale.total_amount)}
                                        </td>
                                        <td>
                                            <span className={`payment-badge ${sale.payment_method.toLowerCase()}`}>
                                                {sale.payment_method}
                                            </span>
                                        </td>
                                        <td>{sale.customer_name || '-'}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-icon btn-edit"
                                                    onClick={() => handleEdit(sale)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-icon btn-delete"
                                                    onClick={() => handleDelete(sale.id, sale.item_name)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SalesList;