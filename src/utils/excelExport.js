/**
 * Excel and CSV export utility with clean spreadsheet formatting matching professional accounting standards
 * Columns: Date | Description | Type | AED | CR / DR | Amount | Balance | Remark
 */

export const exportToCSV = (data, filename = 'ledger_export') => {
  if (!data || !data.length) {
    alert('No data available to export');
    return;
  }

  const headers = [
    'Date',
    'Description',
    'Type',
    'AED',
    'CR / DR',
    'Amount',
    'Balance',
    'Remark',
  ];

  const rows = data.map((item) => {
    const isCr = item.crDr === 'CR' || Number(item.credit) > 0;
    const crDrVal = isCr ? 'CR' : 'DR';
    const amountVal = item.amount || (isCr ? item.credit : item.debit) || 0;
    const aedVal = item.aed && Number(item.aed) > 0 ? Number(item.aed).toFixed(2) : '';

    return [
      `"${item.date || ''}"`,
      `"${(item.description || item.partyName || '').replace(/"/g, '""')}"`,
      `"${item.type || ''}"`,
      aedVal,
      `"${crDrVal}"`,
      amountVal,
      Math.abs(item.runningBal || item.bal || 0),
      `"${(item.remark || item.remarks || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent =
    '\uFEFF' + // UTF-8 BOM
    [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToExcel = (data, firmName = 'Royal Rays Ledger', filename = 'ledger_export') => {
  if (!data || !data.length) {
    alert('No data available to export');
    return;
  }

  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const totalCredit = data.reduce(
    (acc, curr) =>
      acc +
      (curr.crDr === 'CR' || Number(curr.credit) > 0
        ? Number(curr.amount) || Number(curr.credit) || 0
        : 0),
    0
  );
  const totalDebit = data.reduce(
    (acc, curr) =>
      acc +
      (curr.crDr === 'DR' || Number(curr.debit) > 0
        ? Number(curr.amount) || Number(curr.debit) || 0
        : 0),
    0
  );
  const totalAed = data.reduce((acc, curr) => acc + (Number(curr.aed) || 0), 0);
  const netBalance = totalCredit - totalDebit;

  // Calculate dynamic auto column widths based on maximum content length
  const calcWidth = (headerTitle, accessor, minW = 80, maxW = 380) => {
    let maxChars = headerTitle.length;
    data.forEach((item) => {
      const val = String(accessor(item) || '');
      if (val.length > maxChars) {
        maxChars = val.length;
      }
    });
    const calculated = Math.round(maxChars * 8.5 + 28);
    return Math.min(Math.max(calculated, minW), maxW);
  };

  const colWidths = {
    date: calcWidth('Date', (d) => d.date, 90, 130),
    description: calcWidth('Description', (d) => d.description || d.partyName, 200, 420),
    type: calcWidth('Type', (d) => d.type, 95, 150),
    aed: calcWidth('AED', (d) => d.aed ? Number(d.aed).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '', 90, 140),
    crDr: calcWidth('CR / DR', (d) => d.crDr, 75, 95),
    amount: calcWidth('Amount', (d) => Number(d.amount || d.credit || d.debit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }), 115, 170),
    balance: calcWidth('Balance', (d) => Number(d.runningBal || d.bal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }), 115, 170),
    remark: calcWidth('Remark', (d) => d.remark || d.remarks, 160, 420),
  };

  let tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${firmName.substring(0, 30)}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
                <x:AutoFilter x:Range="A3:H3"/>
                <x:DataValidation>
                  <x:Range>E4:E${data.length + 3}</x:Range>
                  <x:Type>List</x:Type>
                  <x:Value>&quot;CR,DR&quot;</x:Value>
                  <x:ShowDropDown/>
                </x:DataValidation>
                <x:DataValidation>
                  <x:Range>C4:C${data.length + 3}</x:Range>
                  <x:Type>List</x:Type>
                  <x:Value>&quot;Bank,Cash,Angadia,Dubai Wire,Cheque&quot;</x:Value>
                  <x:ShowDropDown/>
                </x:DataValidation>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; }
        table { border-collapse: collapse; }
        .firm-title {
          background-color: #FFFFFF;
          color: #0F172A;
          font-size: 13pt;
          font-weight: 600;
          text-align: center;
          height: 32px;
          border-top: 1px solid #CBD5E1;
          border-left: 1px solid #CBD5E1;
          border-right: 1px solid #CBD5E1;
        }
        .sub-title {
          background-color: #FFFFFF;
          color: #64748B;
          font-size: 9pt;
          text-align: center;
          height: 20px;
          border-left: 1px solid #CBD5E1;
          border-right: 1px solid #CBD5E1;
          border-bottom: 1px solid #CBD5E1;
        }
        .th-center {
          background-color: #F1F5F9;
          color: #1E293B;
          font-size: 9.5pt;
          font-weight: 600;
          text-align: center;
          border: 1px solid #CBD5E1;
          height: 26px;
          padding: 4px 6px;
        }
        .th-left {
          background-color: #F1F5F9;
          color: #1E293B;
          font-size: 9.5pt;
          font-weight: 600;
          text-align: left;
          border: 1px solid #CBD5E1;
          height: 26px;
          padding: 4px 6px;
        }
        .th-right {
          background-color: #F1F5F9;
          color: #1E293B;
          font-size: 9.5pt;
          font-weight: 600;
          text-align: right;
          border: 1px solid #CBD5E1;
          height: 26px;
          padding: 4px 6px;
        }
        .td-left {
          border: 1px solid #E2E8F0;
          padding: 5px 6px;
          text-align: left;
          vertical-align: middle;
          color: #1E293B;
          font-size: 9pt;
        }
        .td-center {
          border: 1px solid #E2E8F0;
          padding: 5px 6px;
          text-align: center;
          vertical-align: middle;
          color: #334155;
          font-size: 9pt;
        }
        .td-right {
          border: 1px solid #E2E8F0;
          padding: 5px 6px;
          text-align: right;
          vertical-align: middle;
          color: #0F172A;
          font-size: 9pt;
          mso-number-format: "\\#,##0.00";
        }
        .cr-text {
          color: #15803D;
          font-weight: 500;
          text-align: center;
          border: 1px solid #E2E8F0;
          padding: 5px 6px;
          font-size: 9pt;
        }
        .dr-text {
          color: #B91C1C;
          font-weight: 500;
          text-align: center;
          border: 1px solid #E2E8F0;
          padding: 5px 6px;
          font-size: 9pt;
        }
        .total-cell {
          background-color: #F8FAFC;
          color: #0F172A;
          font-weight: 600;
          font-size: 9pt;
          padding: 6px;
          border-top: 1.5px solid #94A3B8;
          border-bottom: 1.5px solid #94A3B8;
          border-left: 1px solid #E2E8F0;
          border-right: 1px solid #E2E8F0;
        }
      </style>
    </head>
    <body>
      <table border="0" cellpadding="0" cellspacing="0">
        <col width="${colWidths.date}" />
        <col width="${colWidths.description}" />
        <col width="${colWidths.type}" />
        <col width="${colWidths.aed}" />
        <col width="${colWidths.crDr}" />
        <col width="${colWidths.amount}" />
        <col width="${colWidths.balance}" />
        <col width="${colWidths.remark}" />

        <!-- Clean Seamless Title & Subtitle Directly Above Header -->
        <tr>
          <td colspan="8" class="firm-title">${firmName.toUpperCase()} — LEDGER REPORT</td>
        </tr>
        <tr>
          <td colspan="8" class="sub-title">Export Date: ${timestamp} | Royal Rays BV — Antwerp & Surat Bourses</td>
        </tr>

        <!-- Table Header with dynamic widths directly below subtitle -->
        <thead>
          <tr>
            <th class="th-center" style="width: ${colWidths.date}px;">Date</th>
            <th class="th-left" style="width: ${colWidths.description}px;">Description</th>
            <th class="th-center" style="width: ${colWidths.type}px;">Type</th>
            <th class="th-right" style="width: ${colWidths.aed}px;">AED</th>
            <th class="th-center" style="width: ${colWidths.crDr}px;">CR / DR</th>
            <th class="th-right" style="width: ${colWidths.amount}px;">Amount</th>
            <th class="th-right" style="width: ${colWidths.balance}px;">Balance</th>
            <th class="th-left" style="width: ${colWidths.remark}px;">Remark</th>
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach((item) => {
    const isCr = item.crDr === 'CR' || Number(item.credit) > 0;
    const crDrVal = isCr ? 'CR' : 'DR';
    const amountVal = item.amount || (isCr ? item.credit : item.debit) || 0;
    const aedVal =
      item.aed && Number(item.aed) > 0
        ? Number(item.aed).toLocaleString('en-US', { minimumFractionDigits: 2 })
        : '';

    tableHtml += `
      <tr>
        <td class="td-center">${item.date || ''}</td>
        <td class="td-left">${item.description || item.partyName || ''}</td>
        <td class="td-center">${item.type || ''}</td>
        <td class="td-right" style="color: #475569;">${aedVal}</td>
        <td class="${isCr ? 'cr-text' : 'dr-text'}">${crDrVal}</td>
        <td class="td-right">${Number(amountVal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td class="td-right">${Number(Math.abs(item.runningBal || item.bal || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td class="td-left" style="color: #475569;">${item.remark || item.remarks || ''}</td>
      </tr>
    `;
  });

  // Clean, Minimalist Totals Row with Clean Borders and Balanced Typography
  tableHtml += `
        <tr>
          <td class="total-cell" style="text-align: center;">TOTALS</td>
          <td class="total-cell" style="text-align: left;">${data.length} Records</td>
          <td class="total-cell" style="text-align: center;"></td>
          <td class="total-cell" style="text-align: right; color: #475569; mso-number-format: '\\#,##0.00';">${totalAed > 0 ? Number(totalAed).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</td>
          <td class="total-cell" style="text-align: center;"></td>
          <td class="total-cell" style="text-align: right; mso-number-format: '\\#,##0.00';">${Number(totalCredit).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          <td class="total-cell" style="text-align: right; ${netBalance < 0 ? 'color: #B91C1C;' : ''} mso-number-format: '\\#,##0.00';">${Number(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          <td class="total-cell" style="text-align: left; color: #475569;">Net: ${netBalance >= 0 ? 'CR ' : 'DR '}${Math.abs(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>
  </body>
  </html>
  `;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${dateStr}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

