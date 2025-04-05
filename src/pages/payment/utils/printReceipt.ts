import { message } from 'antd';

export const printReceipt = (): void => {
  const printContent = document.querySelector('.payment-receipt-content');
  if (printContent) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>付款详情</title>
            <style>
              body { font-family: sans-serif; }
              .payment-receipt-content { padding: 20px; }
              h2 { text-align: center; margin-bottom: 20px; font-size: 1.5em; }
              .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 20px; margin-bottom: 20px; }
              .details-grid p { margin: 5px 0; }
              .details-grid strong { margin-right: 8px; }
              .remark-section { margin-bottom: 20px; }
              .amount-section { text-align: right; border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px; }
              .amount-section h3 { font-size: 1.2em; margin: 0; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      // Timeout needed for some browsers to ensure content is loaded before print dialog
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      message.error('无法打开打印窗口，请检查浏览器设置');
    }
  } else {
    message.error('无法找到打印内容');
  }
}; 