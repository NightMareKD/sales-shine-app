import React, { useState } from 'react';
import { salesAPI } from '../api';
import './ReportGenerator.css';

const ExcelJS = window.require('exceljs');
const { dialog } = window.require('electron').remote || window.require('@electron/remote');
const fs = window.require('fs');
const path = window.require('path');

function ReportGenerator() {
    // State for report options
    const [reportType, setReportType] = useState('2-week');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [businessName, setBusinessName] = useState('My Clothing Business');
    const [generating, setGenerating] = useState(false);

    // Get date range based on report type
    const getDateRange = () => {
        const today = new Date();
        let startDate, endDate;

        switch(reportType) {
            case '2-week':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 14);
                endDate = today;
                break;
            
            case 'monthly':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            
            case 'custom':
                startDate = new Date(customStartDate);
                endDate = new Date(customEndDate);
                break;
            
            default:
                startDate = today;
                endDate = today;
        }

        return {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        };
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
            month: 'long',
            day: 'numeric'
        });
    };

    // Generate Excel Report
    const generateReport = async () => {
        if (reportType === 'custom' && (!customStartDate || !customEndDate)) {
            alert('Please select both start and end dates for custom report');
            return;
        }

        if (reportType === 'custom' && customStartDate > customEndDate) {
            alert('Start date must be before end date');
            return;
        }

        setGenerating(true);

        try {
            // Get date range
            const dateRange = getDateRange();
            
            // Fetch sales data
            const sales = await salesAPI.getByDateRange(dateRange.start, dateRange.end);

            if (sales.length === 0) {
                alert('No sales found in the selected date range');
                setGenerating(false);
                return;
            }

            // Calculate summary statistics
            const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
            const totalTransactions = sales.length;
            const avgSale = totalRevenue / totalTransactions;
            
            // Group by category
            const categoryTotals = {};
            sales.forEach(sale => {
                if (!categoryTotals[sale.category]) {
                    categoryTotals[sale.category] = 0;
                }
                categoryTotals[sale.category] += sale.total_amount;
            });

            // Group by payment method
            const paymentTotals = {};
            sales.forEach(sale => {
                if (!paymentTotals[sale.payment_method]) {
                    paymentTotals[sale.payment_method] = 0;
                }
                paymentTotals[sale.payment_method] += sale.total_amount;
            });

            // Create Excel workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sales Report');

            // Set column widths
            worksheet.columns = [
                { width: 12 },  // Date
                { width: 25 },  // Item
                { width: 15 },  // Category
                { width: 10 },  // Qty
                { width: 12 },  // Price
                { width: 12 },  // Total
                { width: 15 },  // Payment
                { width: 20 },  // Customer
            ];

            // Add header (Business name and report info)
            let currentRow = 1;
            
            worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
            const titleCell = worksheet.getCell(`A${currentRow}`);
            titleCell.value = businessName;
            titleCell.font = { size: 18, bold: true };
            titleCell.alignment = { horizontal: 'center' };
            currentRow += 2;

            worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
            const subtitleCell = worksheet.getCell(`A${currentRow}`);
            subtitleCell.value = 'SALES REPORT';
            subtitleCell.font = { size: 14, bold: true };
            subtitleCell.alignment = { horizontal: 'center' };
            currentRow += 1;

            worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
            const dateRangeCell = worksheet.getCell(`A${currentRow}`);
            dateRangeCell.value = `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
            dateRangeCell.font = { size: 12 };
            dateRangeCell.alignment = { horizontal: 'center' };
            currentRow += 2;

            // Add summary section
            worksheet.getCell(`A${currentRow}`).value = 'SUMMARY';
            worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
            currentRow += 1;

            worksheet.getCell(`A${currentRow}`).value = 'Total Transactions:';
            worksheet.getCell(`B${currentRow}`).value = totalTransactions;
            currentRow += 1;

            worksheet.getCell(`A${currentRow}`).value = 'Total Revenue:';
            worksheet.getCell(`B${currentRow}`).value = formatCurrency(totalRevenue);
            worksheet.getCell(`B${currentRow}`).font = { bold: true };
            currentRow += 1;

            worksheet.getCell(`A${currentRow}`).value = 'Average Sale:';
            worksheet.getCell(`B${currentRow}`).value = formatCurrency(avgSale);
            currentRow += 2;

            // Category breakdown
            worksheet.getCell(`A${currentRow}`).value = 'SALES BY CATEGORY';
            worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
            currentRow += 1;

            Object.entries(categoryTotals).forEach(([category, total]) => {
                worksheet.getCell(`A${currentRow}`).value = category;
                worksheet.getCell(`B${currentRow}`).value = formatCurrency(total);
                currentRow += 1;
            });
            currentRow += 1;

            // Payment method breakdown
            worksheet.getCell(`A${currentRow}`).value = 'SALES BY PAYMENT METHOD';
            worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
            currentRow += 1;

            Object.entries(paymentTotals).forEach(([method, total]) => {
                worksheet.getCell(`A${currentRow}`).value = method;
                worksheet.getCell(`B${currentRow}`).value = formatCurrency(total);
                currentRow += 1;
            });
            currentRow += 2;

            // Detailed transactions table
            worksheet.getCell(`A${currentRow}`).value = 'DETAILED TRANSACTIONS';
            worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
            currentRow += 1;

            // Table headers
            const headerRow = worksheet.getRow(currentRow);
            headerRow.values = ['Date', 'Item Name', 'Category', 'Qty', 'Unit Price', 'Total', 'Payment', 'Customer'];
            headerRow.font = { bold: true };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
            headerRow.border = {
                bottom: { style: 'thin' }
            };
            currentRow += 1;

            // Add sales data
            sales.forEach(sale => {
                const row = worksheet.getRow(currentRow);
                row.values = [
                    formatDate(sale.date),
                    sale.item_name,
                    sale.category,
                    sale.quantity,
                    formatCurrency(sale.unit_price),
                    formatCurrency(sale.total_amount),
                    sale.payment_method,
                    sale.customer_name || '-'
                ];
                currentRow += 1;
            });

            // Ask user where to save
            const result = await dialog.showSaveDialog({
                title: 'Save Sales Report',
                defaultPath: `Sales_Report_${dateRange.start}_to_${dateRange.end}.xlsx`,
                filters: [
                    { name: 'Excel Files', extensions: ['xlsx'] }
                ]
            });

            if (result.canceled) {
                setGenerating(false);
                return;
            }

            // Write file
            await workbook.xlsx.writeFile(result.filePath);
            
            alert(`Report generated successfully!\nSaved to: ${result.filePath}`);

        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="report-generator-container">
            <div className="report-header">
                <h1>📈 Generate Reports</h1>
                <p>Export your sales data to Excel spreadsheets</p>
            </div>

            <div className="card report-card">
                <h2>Report Configuration</h2>

                {/* Business Name */}
                <div className="form-group">
                    <label>Business Name</label>
                    <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your business name"
                    />
                    <small>This will appear at the top of your report</small>
                </div>

                {/* Report Type Selection */}
                <div className="form-group">
                    <label>Report Type</label>
                    <div className="report-type-options">
                        <button
                            className={`report-type-btn ${reportType === '2-week' ? 'active' : ''}`}
                            onClick={() => setReportType('2-week')}
                        >
                            <div className="report-type-icon">📅</div>
                            <div className="report-type-title">2-Week Report</div>
                            <div className="report-type-desc">Last 14 days</div>
                        </button>

                        <button
                            className={`report-type-btn ${reportType === 'monthly' ? 'active' : ''}`}
                            onClick={() => setReportType('monthly')}
                        >
                            <div className="report-type-icon">📆</div>
                            <div className="report-type-title">Monthly Report</div>
                            <div className="report-type-desc">Current month</div>
                        </button>

                        <button
                            className={`report-type-btn ${reportType === 'custom' ? 'active' : ''}`}
                            onClick={() => setReportType('custom')}
                        >
                            <div className="report-type-icon">🗓️</div>
                            <div className="report-type-title">Custom Range</div>
                            <div className="report-type-desc">Choose dates</div>
                        </button>
                    </div>
                </div>

                {/* Custom Date Range (only shown when custom is selected) */}
                {reportType === 'custom' && (
                    <div className="custom-date-range">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Report Preview Info */}
                <div className="report-preview">
                    <h3>Report Will Include:</h3>
                    <ul>
                        <li>✓ Summary statistics (total sales, revenue, average)</li>
                        <li>✓ Sales breakdown by category</li>
                        <li>✓ Sales breakdown by payment method</li>
                        <li>✓ Detailed transaction list with all fields</li>
                        <li>✓ Professional formatting and styling</li>
                    </ul>
                </div>

                {/* Generate Button */}
                <button
                    className="btn btn-primary btn-large"
                    onClick={generateReport}
                    disabled={generating}
                >
                    {generating ? '⏳ Generating Report...' : '📥 Generate & Download Report'}
                </button>
            </div>

            {/* Help Section */}
            <div className="card help-card">
                <h3>💡 Tips</h3>
                <ul>
                    <li>Reports are saved as Excel files (.xlsx) that you can open in Microsoft Excel, Google Sheets, or any spreadsheet software</li>
                    <li>2-Week reports show the last 14 days of sales</li>
                    <li>Monthly reports show sales from the 1st to the last day of the current month</li>
                    <li>Use Custom Range to generate reports for specific date periods</li>
                    <li>All reports include detailed breakdowns and summary statistics</li>
                </ul>
            </div>
        </div>
    );
}

export default ReportGenerator;