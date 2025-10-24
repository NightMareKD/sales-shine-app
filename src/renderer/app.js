import React, { useState } from 'react';
import './App.css';

// Import components (we'll create these next)
import Dashboard from './components/Dashboard';
import SaleForm from './components/SaleForm';
import SalesList from './components/SalesList';
import ReportGenerator from './components/ReportGenerator';

function App() {
    // State to track which page/view we're on
    const [currentView, setCurrentView] = useState('dashboard');
    
    // State to force refresh when data changes
    const [refreshKey, setRefreshKey] = useState(0);

    // Function to refresh data after adding/editing/deleting
    const handleDataChange = () => {
        setRefreshKey(prev => prev + 1);
    };

    // Function to render the correct component based on currentView
    const renderView = () => {
        switch(currentView) {
            case 'dashboard':
                return <Dashboard key={refreshKey} onNewSale={() => setCurrentView('new-sale')} />;
            case 'new-sale':
                return <SaleForm onSave={handleDataChange} onCancel={() => setCurrentView('dashboard')} />;
            case 'sales-list':
                return <SalesList key={refreshKey} onDataChange={handleDataChange} />;
            case 'reports':
                return <ReportGenerator />;
            default:
                return <Dashboard key={refreshKey} onNewSale={() => setCurrentView('new-sale')} />;
        }
    };

    return (
        <div className="app">
            {/* Sidebar Navigation */}
            <div className="sidebar">
                <div className="logo">
                    <h1>📊 Sales Tracker</h1>
                    <p>Clothing Business</p>
                </div>

                <nav className="nav-menu">
                    <button 
                        className={currentView === 'dashboard' ? 'active' : ''}
                        onClick={() => setCurrentView('dashboard')}
                    >
                        🏠 Dashboard
                    </button>
                    
                    <button 
                        className={currentView === 'new-sale' ? 'active' : ''}
                        onClick={() => setCurrentView('new-sale')}
                    >
                        ➕ New Sale
                    </button>
                    
                    <button 
                        className={currentView === 'sales-list' ? 'active' : ''}
                        onClick={() => setCurrentView('sales-list')}
                    >
                        📋 All Sales
                    </button>
                    
                    <button 
                        className={currentView === 'reports' ? 'active' : ''}
                        onClick={() => setCurrentView('reports')}
                    >
                        📈 Reports
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <p>Version 1.0.0</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                {renderView()}
            </div>
        </div>
    );
}

export default App;