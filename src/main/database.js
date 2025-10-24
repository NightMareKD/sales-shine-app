const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

// Create database file in user's app data folder
const dbPath = path.join(app.getPath('userData'), 'sales.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
function initDatabase() {
    // Create sales table
    db.exec(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            item_name TEXT NOT NULL,
            category TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            total_amount REAL NOT NULL,
            payment_method TEXT NOT NULL,
            customer_name TEXT,
            notes TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create categories table
    db.exec(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    `);

    // Insert default categories if table is empty
    const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
    if (categoryCount.count === 0) {
        const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
        const defaultCategories = ['Shirts', 'Pants', 'Dresses', 'Jackets', 'Accessories', 'Shoes'];
        
        defaultCategories.forEach(category => {
            insertCategory.run(category);
        });
    }

    console.log('Database initialized at:', dbPath);
}

// Sales Operations

// Add a new sale
function addSale(sale) {
    const stmt = db.prepare(`
        INSERT INTO sales (date, item_name, category, quantity, unit_price, total_amount, payment_method, customer_name, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
        sale.date,
        sale.item_name,
        sale.category,
        sale.quantity,
        sale.unit_price,
        sale.total_amount,
        sale.payment_method,
        sale.customer_name || null,
        sale.notes || null
    );
    
    return result.lastInsertRowid;
}

// Get all sales
function getAllSales() {
    const stmt = db.prepare('SELECT * FROM sales ORDER BY date DESC, created_at DESC');
    return stmt.all();
}

// Get sales by date range
function getSalesByDateRange(startDate, endDate) {
    const stmt = db.prepare('SELECT * FROM sales WHERE date BETWEEN ? AND ? ORDER BY date DESC');
    return stmt.all(startDate, endDate);
}

// Get single sale by ID
function getSaleById(id) {
    const stmt = db.prepare('SELECT * FROM sales WHERE id = ?');
    return stmt.get(id);
}

// Update a sale
function updateSale(id, sale) {
    const stmt = db.prepare(`
        UPDATE sales 
        SET date = ?, item_name = ?, category = ?, quantity = ?, unit_price = ?, 
            total_amount = ?, payment_method = ?, customer_name = ?, notes = ?
        WHERE id = ?
    `);
    
    const result = stmt.run(
        sale.date,
        sale.item_name,
        sale.category,
        sale.quantity,
        sale.unit_price,
        sale.total_amount,
        sale.payment_method,
        sale.customer_name || null,
        sale.notes || null,
        id
    );
    
    return result.changes;
}

// Delete a sale
function deleteSale(id) {
    const stmt = db.prepare('DELETE FROM sales WHERE id = ?');
    const result = stmt.run(id);
    return result.changes;
}

// Analytics Functions

// Get total sales for today
function getTodaySales() {
    const today = new Date().toISOString().split('T')[0];
    const stmt = db.prepare('SELECT SUM(total_amount) as total FROM sales WHERE date = ?');
    const result = stmt.get(today);
    return result.total || 0;
}

// Get total sales for current week
function getWeekSales() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    const stmt = db.prepare('SELECT SUM(total_amount) as total FROM sales WHERE date >= ?');
    const result = stmt.get(weekAgo.toISOString().split('T')[0]);
    return result.total || 0;
}

// Get total sales for current month
function getMonthSales() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const stmt = db.prepare('SELECT SUM(total_amount) as total FROM sales WHERE date >= ?');
    const result = stmt.get(firstDay.toISOString().split('T')[0]);
    return result.total || 0;
}

// Get top selling items
function getTopSellingItems(limit = 5) {
    const stmt = db.prepare(`
        SELECT item_name, category, SUM(quantity) as total_quantity, SUM(total_amount) as total_revenue
        FROM sales
        GROUP BY item_name, category
        ORDER BY total_quantity DESC
        LIMIT ?
    `);
    return stmt.all(limit);
}

// Get sales by category
function getSalesByCategory() {
    const stmt = db.prepare(`
        SELECT category, COUNT(*) as count, SUM(total_amount) as total
        FROM sales
        GROUP BY category
        ORDER BY total DESC
    `);
    return stmt.all();
}

// Get sales by payment method
function getSalesByPaymentMethod() {
    const stmt = db.prepare(`
        SELECT payment_method, COUNT(*) as count, SUM(total_amount) as total
        FROM sales
        GROUP BY payment_method
    `);
    return stmt.all();
}

// Category Operations
function getAllCategories() {
    const stmt = db.prepare('SELECT * FROM categories ORDER BY name');
    return stmt.all();
}

function addCategory(name) {
    const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
    return stmt.run(name);
}

// Export all functions
module.exports = {
    initDatabase,
    addSale,
    getAllSales,
    getSalesByDateRange,
    getSaleById,
    updateSale,
    deleteSale,
    getTodaySales,
    getWeekSales,
    getMonthSales,
    getTopSellingItems,
    getSalesByCategory,
    getSalesByPaymentMethod,
    getAllCategories,
    addCategory
};