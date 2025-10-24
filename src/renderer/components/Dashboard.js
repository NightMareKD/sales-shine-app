import React, { useState, useEffect } from 'react';
import { analyticsAPI, salesAPI } from '../api';
import './Dashboard.css';

function Dashboard({ onNewSale }) {
    // State to hold all our dashboard data
    const [stats, setStats] = useState({
        today: 0,
        week: 0,
        month: 0
    });
    
    const [topItems, setTopItems] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState([]);
    const [paymentBreakdown, setPaymentBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load all dashboard data when component mounts
    useEffect(() => {
        loadDashboardData();
    }, []);

    // Function to fetch all data from database
    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel (faster than one-by-one)
            const [
                todaySales,
                weekSales,
                monthSales,
                topSellingItems,
                allSales,
                categorySales,
                paymentSales
            ] = await Promise.all([
                analyticsAPI.getToday(),
                analyticsAPI.getWeek(),
                analyticsAPI.getMonth(),
                analyticsAPI.getTopItems(5),
                salesAPI.getAll(),
                analyticsAPI.getByCategory(),
                analyticsAPI.getByPaymentMethod()
            ]);

            // Update state with fetched data
            setStats({
                today: todaySales,
                week: weekSales,
                month: monthSales
            });

            setTopItems(topSellingItems);
            setRecentSales(allSales.slice(0, 10)); // Get latest 10 sales
            setCategoryBreakdown(categorySales);
            setPaymentBreakdown(paymentSales);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            alert('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
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
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Show loading state
    if (loading) {
        return (
            <div className="loading">
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Page Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your sales performance</p>
                </div>
                <button className="btn btn-primary" onClick={onNewSale}>
                    ➕ New Sale
                </button>
            </div>

            {/* Stats Cards - Today, Week, Month */}
            <div className="stats-grid">
                <div className="stat-card" style={{borderLeftColor: '#3498db'}}>
                    <h3>Today's Sales</h3>
                    <div className="value">{formatCurrency(stats.today)}</div>
                </div>

                <div className="stat-card" style={{borderLeftColor: '#2ecc71'}}>
                    <h3>This Week</h3>
                    <div className="value">{formatCurrency(stats.week)}</div>
                </div>

                <div className="stat-card" style={{borderLeftColor: '#9b59b6'}}>
                    <h3>This Month</h3>
                    <div className="value">{formatCurrency(stats.month)}</div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="dashboard-grid">
                {/* Left Column */}
                <div className="dashboard-column">
                    {/* Top Selling Items */}
                    <div className="card">
                        <h2>🏆 Top Selling Items</h2>
                        {topItems.length === 0 ? (
                            <div className="empty-state">
                                <p>No sales data yet</p>
                            </div>
                        ) : (
                            <div className="top-items-list">
                                {topItems.map((item, index) => (
                                    <div key={index} className="top-item">
                                        <div className="item-rank">{index + 1}</div>
                                        <div className="item-details">
                                            <div className="item-name">{item.item_name}</div>
                                            <div className="item-category">{item.category}</div>
                                        </div>
                                        <div className="item-stats">
                                            <div className="item-quantity">
                                                {item.total_quantity} sold
                                            </div>
                                            <div className="item-revenue">
                                                {formatCurrency(item.total_revenue)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category Breakdown */}
                    <div className="card">
                        <h2>📊 Sales by Category</h2>
                        {categoryBreakdown.length === 0 ? (
                            <div className="empty-state">
                                <p>No category data yet</p>
                            </div>
                        ) : (
                            <div className="breakdown-list">
                                {categoryBreakdown.map((cat, index) => (
                                    <div key={index} className="breakdown-item">
                                        <div className="breakdown-name">{cat.category}</div>
                                        <div className="breakdown-bar">
                                            <div 
                                                className="breakdown-fill"
                                                style={{
                                                    width: `${(cat.total / categoryBreakdown[0].total) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <div className="breakdown-value">
                                            {formatCurrency(cat.total)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="dashboard-column">
                    {/* Recent Sales */}
                    <div className="card">
                        <h2>📋 Recent Sales</h2>
                        {recentSales.length === 0 ? (
                            <div className="empty-state">
                                <p>No sales yet. Click "New Sale" to get started!</p>
                            </div>
                        ) : (
                            <div className="recent-sales-list">
                                {recentSales.map((sale) => (
                                    <div key={sale.id} className="recent-sale-item">
                                        <div className="sale-date">{formatDate(sale.date)}</div>
                                        <div className="sale-info">
                                            <div className="sale-item">{sale.item_name}</div>
                                            <div className="sale-details">
                                                {sale.quantity} × {formatCurrency(sale.unit_price)}
                                            </div>
                                        </div>
                                        <div className="sale-total">
                                            {formatCurrency(sale.total_amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment Method Breakdown */}
                    <div className="card">
                        <h2>💳 Payment Methods</h2>
                        {paymentBreakdown.length === 0 ? (
                            <div className="empty-state">
                                <p>No payment data yet</p>
                            </div>
                        ) : (
                            <div className="payment-grid">
                                {paymentBreakdown.map((payment, index) => (
                                    <div key={index} className="payment-card">
                                        <div className="payment-method">
                                            {payment.payment_method}
                                        </div>
                                        <div className="payment-count">
                                            {payment.count} transactions
                                        </div>
                                        <div className="payment-total">
                                            {formatCurrency(payment.total)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;