export const exportToWord = (elementId: string, filename: string = 'Surat.doc') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Clone element to manipulate without affecting DOM
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Convert images to base64 or make them absolute URLs if they aren't, 
  // but since they are absolute Supabase URLs, Word might be able to fetch them.
  // We'll leave them as is for now.

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${filename}</title>
      <style>
        body { font-family: 'Times New Roman', serif; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .font-black { font-weight: 900; }
        .italic { font-style: italic; }
        .underline { text-decoration: underline; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-8 { margin-top: 2rem; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        table { width: 100%; }
        td { vertical-align: top; }
      </style>
    </head>
    <body>
      ${clone.innerHTML}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });

  const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (elementId: string, filename: string = 'Surat.pdf') => {
  // Using print dialog is the most robust way without heavy libraries
  // We'll add a temporary print class to body
  const element = document.getElementById(elementId);
  if (!element) return;

  const originalTitle = document.title;
  document.title = filename.replace('.pdf', '');

  // Add a style tag for printing
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      body * {
        visibility: hidden;
      }
      #${elementId}, #${elementId} * {
        visibility: visible;
      }
      #${elementId} {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        box-shadow: none !important;
      }
      @page {
        size: A4;
        margin: 20mm;
      }
    }
  `;
  document.head.appendChild(style);

  window.print();

  document.head.removeChild(style);
  document.title = originalTitle;
};
