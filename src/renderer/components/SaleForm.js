import React, { useState, useEffect } from 'react';
import { salesAPI, categoriesAPI } from '../api';
import './SaleForm.css';

function SaleForm({ onSave, onCancel, editSale = null }) {
    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Form state - all the fields
    const [formData, setFormData] = useState({
        date: getTodayDate(),
        item_name: '',
        category: '',
        quantity: 1,
        unit_price: '',
        payment_method: 'Cash',
        customer_name: '',
        notes: ''
    });

    // Calculated total amount
    const [totalAmount, setTotalAmount] = useState(0);
    
    // Available categories from database
    const [categories, setCategories] = useState([]);
    
    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Load categories when component mounts
    useEffect(() => {
        loadCategories();
        
        // If editing an existing sale, populate the form
        if (editSale) {
            setFormData({
                date: editSale.date,
                item_name: editSale.item_name,
                category: editSale.category,
                quantity: editSale.quantity,
                unit_price: editSale.unit_price,
                payment_method: editSale.payment_method,
                customer_name: editSale.customer_name || '',
                notes: editSale.notes || ''
            });
        }
    }, [editSale]);

    // Calculate total whenever quantity or price changes
    useEffect(() => {
        const quantity = parseFloat(formData.quantity) || 0;
        const unitPrice = parseFloat(formData.unit_price) || 0;
        setTotalAmount(quantity * unitPrice);
    }, [formData.quantity, formData.unit_price]);

    // Load categories from database
    const loadCategories = async () => {
        try {
            const cats = await categoriesAPI.getAll();
            setCategories(cats);
            
            // Set default category if not editing
            if (!editSale && cats.length > 0) {
                setFormData(prev => ({ ...prev, category: cats[0].name }));
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};

        if (!formData.item_name.trim()) {
            newErrors.item_name = 'Item name is required';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        if (!formData.quantity || formData.quantity <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        if (!formData.unit_price || formData.unit_price <= 0) {
            newErrors.unit_price = 'Price must be greater than 0';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Prepare sale object
            const saleData = {
                ...formData,
                quantity: parseInt(formData.quantity),
                unit_price: parseFloat(formData.unit_price),
                total_amount: totalAmount
            };

            // Add or update sale
            if (editSale) {
                await salesAPI.update(editSale.id, saleData);
                alert('Sale updated successfully!');
            } else {
                await salesAPI.add(saleData);
                alert('Sale added successfully!');
            }

            // Notify parent component
            onSave();

            // Reset form if adding new (not editing)
            if (!editSale) {
                resetForm();
            }

        } catch (error) {
            console.error('Error saving sale:', error);
            alert('Failed to save sale. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            date: getTodayDate(),
            item_name: '',
            category: categories[0]?.name || '',
            quantity: 1,
            unit_price: '',
            payment_method: 'Cash',
            customer_name: '',
            notes: ''
        });
        setErrors({});
    };

    // Format currency for display
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR'
        }).format(amount);
    };

    return (
        <div className="sale-form-container">
            <div className="card">
                <div className="form-header">
                    <h2>{editSale ? '✏️ Edit Sale' : '➕ Add New Sale'}</h2>
                    <p>Enter the details of the sale transaction</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Date Field */}
                    <div className="form-group">
                        <label>
                            Date <span className="required">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            max={getTodayDate()}
                            className={errors.date ? 'error' : ''}
                        />
                        {errors.date && <span className="error-message">{errors.date}</span>}
                    </div>

                    {/* Item Name & Category Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                Item Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="item_name"
                                placeholder="e.g., Blue Cotton Shirt"
                                value={formData.item_name}
                                onChange={handleChange}
                                className={errors.item_name ? 'error' : ''}
                            />
                            {errors.item_name && (
                                <span className="error-message">{errors.item_name}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                                Category <span className="required">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={errors.category ? 'error' : ''}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <span className="error-message">{errors.category}</span>
                            )}
                        </div>
                    </div>

                    {/* Quantity & Price Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                Quantity <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                value={formData.quantity}
                                onChange={handleChange}
                                className={errors.quantity ? 'error' : ''}
                            />
                            {errors.quantity && (
                                <span className="error-message">{errors.quantity}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                                Unit Price <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="unit_price"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.unit_price}
                                onChange={handleChange}
                                className={errors.unit_price ? 'error' : ''}
                            />
                            {errors.unit_price && (
                                <span className="error-message">{errors.unit_price}</span>
                            )}
                        </div>
                    </div>

                    {/* Total Amount Display */}
                    <div className="total-display">
                        <span>Total Amount:</span>
                        <span className="total-value">{formatCurrency(totalAmount)}</span>
                    </div>

                    {/* Payment Method */}
                    <div className="form-group">
                        <label>Payment Method</label>
                        <select
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="Online">Online Transfer</option>
                            <option value="Check">Check</option>
                        </select>
                    </div>

                    {/* Customer Name (Optional) */}
                    <div className="form-group">
                        <label>Customer Name (Optional)</label>
                        <input
                            type="text"
                            name="customer_name"
                            placeholder="Enter customer name"
                            value={formData.customer_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Notes (Optional) */}
                    <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea
                            name="notes"
                            placeholder="Add any additional notes..."
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="button-group">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : editSale ? 'Update Sale' : 'Save Sale'}
                        </button>

                        {!editSale && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                                disabled={loading}
                            >
                                Clear Form
                            </button>
                        )}

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SaleForm;