// Import Electron modules
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database');
const remoteMain = require('@electron/remote/main');

// Disable hardware acceleration to fix GPU process errors
// This is recommended for cross-platform compatibility (Windows & Mac)
app.disableHardwareAcceleration();

// Initialize remote module
remoteMain.initialize();

// Initialize database when app starts
app.on('ready', () => {
    db.initDatabase();
    console.log('Database ready!');
});

// IPC Handlers - these allow React to communicate with the database

// Sales operations
ipcMain.handle('add-sale', async (event, sale) => {
    return db.addSale(sale);
});

ipcMain.handle('get-all-sales', async () => {
    return db.getAllSales();
});

ipcMain.handle('get-sale-by-id', async (event, id) => {
    return db.getSaleById(id);
});

ipcMain.handle('update-sale', async (event, id, sale) => {
    return db.updateSale(id, sale);
});

ipcMain.handle('delete-sale', async (event, id) => {
    return db.deleteSale(id);
});

ipcMain.handle('get-sales-by-date-range', async (event, startDate, endDate) => {
    return db.getSalesByDateRange(startDate, endDate);
});

// Analytics operations
ipcMain.handle('get-today-sales', async () => {
    return db.getTodaySales();
});

ipcMain.handle('get-week-sales', async () => {
    return db.getWeekSales();
});

ipcMain.handle('get-month-sales', async () => {
    return db.getMonthSales();
});

ipcMain.handle('get-top-selling-items', async (event, limit) => {
    return db.getTopSellingItems(limit);
});

ipcMain.handle('get-sales-by-category', async () => {
    return db.getSalesByCategory();
});

ipcMain.handle('get-sales-by-payment-method', async () => {
    return db.getSalesByPaymentMethod();
});

// Category operations
ipcMain.handle('get-all-categories', async () => {
    return db.getAllCategories();
});

ipcMain.handle('add-category', async (event, name) => {
    return db.addCategory(name);
});

// Keep a global reference of the window object
let mainWindow;

// This function creates the main application window
function createWindow() {
    // Create the browser window with specific dimensions
    mainWindow = new BrowserWindow({
        width: 1200,           // Window width
        height: 800,           // Window height
        minWidth: 1000,        // Minimum width (prevents too small)
        minHeight: 600,        // Minimum height
        webPreferences: {
            // Security and integration settings
            nodeIntegration: true,      // Allow Node.js in renderer
            contextIsolation: false,    // Allow direct access (we'll improve this later)
            enableRemoteModule: true,   // Allow remote module access
            offscreen: false            // Disable offscreen rendering
        },
        // Window appearance
        backgroundColor: '#f5f5f5',
        titleBarStyle: 'default',
        // Start in center of screen
        center: true,
        // Show window only when ready (prevents white flash)
        show: false
    });

    // Enable remote module for this window
    remoteMain.enable(mainWindow.webContents);

    // Load the HTML file
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));

    // Show window when ready to show (smooth loading)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Open DevTools in development (helpful for debugging)
    // Comment this out when you don't need it
    mainWindow.webContents.openDevTools();

    // Handle window closed
    mainWindow.on('closed', () => {
        // Dereference the window object
        mainWindow = null;
    });
}

// This runs when Electron finishes initializing
app.whenReady().then(() => {
    createWindow();

    // On macOS, re-create window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    // On macOS, apps stay active until user quits explicitly
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Log when app is ready (for debugging)
app.on('ready', () => {
    console.log('Clothing Sales Tracker is ready!');
});