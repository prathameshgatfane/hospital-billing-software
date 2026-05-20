import xlsx from 'xlsx';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @returns {string} - CSV string
 */
export const exportToCSV = (data) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      let value = row[header] || '';
      
      // Handle special characters and wrap in quotes if needed
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma, newline, or quotes
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
      }
      
      return value;
    });
    
    csvContent += values.join(',') + '\n';
  });
  
  return csvContent;
};

/**
 * Export data to Excel format
 * @param {Array} data - Array of objects to export
 * @param {string} sheetName - Name of the Excel sheet
 * @returns {Buffer} - Excel file buffer
 */
export const exportToExcel = async (data, sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Create a new workbook
  const workbook = xlsx.utils.book_new();
  
  // Convert data to worksheet
  const worksheet = xlsx.utils.json_to_sheet(data, {
    header: Object.keys(data[0]),
    skipHeader: false
  });
  
  // Add column widths for better formatting
  const maxWidths = {};
  data.forEach(row => {
    Object.keys(row).forEach(key => {
      const value = String(row[key] || '');
      const length = value.length;
      if (!maxWidths[key] || length > maxWidths[key]) {
        maxWidths[key] = Math.min(length, 50); // Max width 50 chars
      }
    });
  });
  
  worksheet['!cols'] = Object.keys(maxWidths).map(key => ({
    wch: maxWidths[key] + 2 // Add padding
  }));
  
  // Add worksheet to workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate buffer
  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  return buffer;
};

/**
 * Export data to PDF format
 * @param {Array} data - Array of objects to export
 * @param {string} title - Title of the PDF document
 * @returns {Buffer} - PDF file buffer
 */
export const exportToPDF = async (data, title = 'Export') => {
  return new Promise((resolve, reject) => {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export');
      }

      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];
      
      // Collect PDF data
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // Add title
      doc.fontSize(20)
         .font('Helvetica-Bold')
         .text(title, { align: 'center' })
         .moveDown(2);
      
      // Add export date
      doc.fontSize(10)
         .font('Helvetica')
         .text(`Exported on: ${new Date().toLocaleString()}`, { align: 'right' })
         .moveDown(1);
      
      // Add total count
      doc.fontSize(12)
         .text(`Total Records: ${data.length}`)
         .moveDown(2);
      
      // Get headers from first object
      const headers = Object.keys(data[0]);
      
      // Calculate column widths
      const pageWidth = doc.page.width - 100; // Account for margins
      const columnCount = headers.length;
      const columnWidth = pageWidth / columnCount;
      
      // Draw table header
      doc.font('Helvetica-Bold')
         .fontSize(10);
      
      let x = 50;
      let y = doc.y;
      
      // Draw header background
      doc.rect(x, y, pageWidth, 25)
         .fillAndStroke('#f0f0f0', '#333')
         .fillColor('#000');
      
      // Draw header text
      headers.forEach((header, index) => {
        doc.text(header, x + 5, y + 10, {
          width: columnWidth - 10,
          align: 'left',
          ellipsis: true
        });
        x += columnWidth;
      });
      
      y += 30;
      
      // Draw data rows
      doc.font('Helvetica')
         .fontSize(9);
      
      data.forEach((row, rowIndex) => {
        // Alternate row colors
        if (rowIndex % 2 === 0) {
          doc.rect(50, y - 5, pageWidth, 20)
             .fillColor('#f9f9f9')
             .fill();
        }
        
        x = 50;
        headers.forEach((header, colIndex) => {
          const value = String(row[header] || '');
          
          doc.fillColor('#000')
             .text(value, x + 5, y, {
               width: columnWidth - 10,
               align: 'left',
               ellipsis: true,
               height: 20
             });
          
          x += columnWidth;
        });
        
        y += 20;
        
        // Check for page break
        if (y > doc.page.height - 50) {
          doc.addPage();
          y = 50;
          
          // Redraw header on new page
          doc.font('Helvetica-Bold')
             .fontSize(10)
             .fillColor('#000');
          
          x = 50;
          doc.rect(x, y, pageWidth, 25)
             .fillAndStroke('#f0f0f0', '#333');
          
          headers.forEach((header, index) => {
            doc.text(header, x + 5, y + 10, {
              width: columnWidth - 10,
              align: 'left',
              ellipsis: true
            });
            x += columnWidth;
          });
          
          y += 30;
          doc.font('Helvetica').fontSize(9);
        }
      });
      
      // Add footer
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fontSize(8)
           .font('Helvetica')
           .fillColor('#666')
           .text(
             `Page ${i + 1} of ${totalPages}`,
             50,
             doc.page.height - 30,
             { align: 'center', width: doc.page.width - 100 }
           );
      }
      
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Helper function to format date for export
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateForExport = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD format
};

/**
 * Helper function to format currency for export
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
export const formatCurrencyForExport = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Export data to JSON format
 * @param {Array} data - Array of objects to export
 * @returns {string} - JSON string
 */
export const exportToJSON = (data) => {
  return JSON.stringify(data, null, 2);
};