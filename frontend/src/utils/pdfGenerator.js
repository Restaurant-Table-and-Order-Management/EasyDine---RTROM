import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a professional PDF invoice for EasyDine transactions.
 * Uses standard fonts and robust layout for cross-platform compatibility.
 */
export const generateSafeInvoicePDF = (billData, reservation) => {
  console.log('Generating Invoice with new layout...');
  try {
    const doc = new jsPDF();
    const brandColor = [249, 115, 22]; // brand-orange
    const secondaryColor = [71, 85, 105]; // gray-600

    // Safety checks
    if (!billData || !billData.items) {
        console.error('Invalid bill data:', billData);
        throw new Error('Billing data is missing or incomplete');
    }

    // --- 1. Top Header Banner ---
    doc.setFillColor(...brandColor);
    doc.rect(0, 0, 210, 50, 'F');
    
    // Logo / Brand Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('EasyDine', 20, 30);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('PREMIUM DINING EXPERIENCE • SMART ORDERING', 20, 38);

    // Invoice Label (Right Aligned)
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL INVOICE', 190, 30, { align: 'right' });

    // --- 2. Information Section ---
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EasyDine Restaurant RTROM', 20, 65);
    
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('123 Gourmet Street, Foodie Central', 20, 71);
    doc.text('GSTIN: 27AAAAA0000A1Z5', 20, 76);

    // Customer Side
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BILLING TO:', 130, 65);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`${billData.customerName || 'Guest'}`, 130, 71);
    doc.text(`Inv No: #${(billData.reservationId || Date.now())}`, 130, 77);
    doc.text(`Date: ${reservation?.reservationDate || 'Today'}`, 130, 83);
    doc.text(`Table: ${billData.tableNumber || 'N/A'}`, 130, 89);

    // --- 3. Items Table ---
    const tableRows = billData.items.map(item => [
      item.name || 'Menu Item',
      `${(item.unitPrice || 0).toFixed(2)}`,
      (item.quantity || 0).toString(),
      `${(item.totalPrice || 0).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 100,
      head: [['Description', 'Unit Price (INR)', 'Qty', 'Total (INR)']],
      body: tableRows,
      headStyles: { 
        fillColor: brandColor, 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        fontSize: 10
      },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'center' },
        3: { halign: 'right' }
      },
      styles: { fontSize: 9 },
      margin: { left: 20, right: 20 }
    });

    // --- 4. Totals Section ---
    let finalY = doc.lastAutoTable.finalY + 15;
    const labelX = 130;
    const valueX = 190;

    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    
    doc.text('Subtotal:', labelX, finalY);
    doc.text(`${(billData.subtotal || 0).toFixed(2)}`, valueX, finalY, { align: 'right' });

    finalY += 7;
    doc.text('GST (5%):', labelX, finalY);
    doc.text(`${(billData.taxAmount || 0).toFixed(2)}`, valueX, finalY, { align: 'right' });

    finalY += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(labelX, finalY - 5, 190, finalY - 5);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...brandColor);
    doc.text('GRAND TOTAL:', labelX, finalY);
    doc.text(`${(billData.grandTotal || 0).toFixed(2)}`, valueX, finalY, { align: 'right' });

    finalY += 8;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('All amounts are in Indian Rupees (INR)', 190, finalY, { align: 'right' });

    // --- 5. Footer ---
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text('THANK YOU FOR DINING WITH EASYDINE', 105, pageHeight - 20, { align: 'center' });

    // Save with customer name for easy identification
    const fileName = `${(billData.customerName || 'Guest').replace(/\s+/g, '_')}_Bill.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('PDF Error:', error);
    throw error;
  }
};
