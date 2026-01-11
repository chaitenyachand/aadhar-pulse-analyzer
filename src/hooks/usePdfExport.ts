import { useCallback, useState } from "react";

interface ExportOptions {
  title: string;
  subtitle?: string;
  includeCharts?: boolean;
  includeData?: boolean;
  orientation?: "portrait" | "landscape";
}

export function usePdfExport() {
  const [isExporting, setIsExporting] = useState(false);

  const generatePdfContent = useCallback(
    (options: ExportOptions, data: any) => {
      // Create a print-friendly version of the content
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Could not open print window. Please check popup settings.");
      }

      const currentDate = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${options.title} - Aadhaar Analytics Report</title>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Outfit', sans-serif;
              color: #1a1a2e;
              line-height: 1.6;
              padding: 40px;
              max-width: 1200px;
              margin: 0 auto;
            }
            
            h1, h2, h3, h4 {
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 600;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 3px solid #0077BE;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .logo-section {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            
            .logo {
              width: 50px;
              height: 50px;
              background: linear-gradient(135deg, #0077BE, #FF9933);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 24px;
            }
            
            .report-info {
              text-align: right;
            }
            
            .report-info .date {
              color: #666;
              font-size: 14px;
            }
            
            .report-title {
              font-size: 28px;
              color: #0077BE;
              margin-bottom: 8px;
            }
            
            .report-subtitle {
              font-size: 16px;
              color: #666;
            }
            
            .tricolor-bar {
              height: 4px;
              background: linear-gradient(90deg, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%);
              margin: 20px 0;
            }
            
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 18px;
              color: #1a1a2e;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e0e0e0;
            }
            
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 25px;
            }
            
            .stat-card {
              background: linear-gradient(135deg, #f8f9fa, #ffffff);
              border: 1px solid #e0e0e0;
              border-radius: 10px;
              padding: 15px;
              text-align: center;
            }
            
            .stat-card.primary {
              border-color: #0077BE;
              border-width: 2px;
            }
            
            .stat-value {
              font-size: 24px;
              font-weight: 700;
              color: #0077BE;
            }
            
            .stat-label {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            }
            
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            
            .data-table th,
            .data-table td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e0e0e0;
            }
            
            .data-table th {
              background: #f8f9fa;
              font-weight: 600;
              color: #1a1a2e;
            }
            
            .data-table tr:nth-child(even) {
              background: #fafafa;
            }
            
            .insight-box {
              background: linear-gradient(135deg, #0077BE08, #FF993308);
              border-left: 4px solid #0077BE;
              padding: 15px 20px;
              margin: 20px 0;
              border-radius: 0 8px 8px 0;
            }
            
            .insight-box h4 {
              color: #0077BE;
              margin-bottom: 8px;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
            
            .footer .confidential {
              color: #FF9933;
              font-weight: 500;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              
              .section {
                page-break-inside: avoid;
              }
              
              .stats-grid {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <div class="logo">A</div>
              <div>
                <h1 class="report-title">${options.title}</h1>
                ${options.subtitle ? `<p class="report-subtitle">${options.subtitle}</p>` : ""}
              </div>
            </div>
            <div class="report-info">
              <p class="date">Generated: ${currentDate}</p>
              <p class="date">Aadhaar Analytics Platform</p>
            </div>
          </div>
          
          <div class="tricolor-bar"></div>
          
          ${data.stats ? `
            <div class="section">
              <h2 class="section-title">Executive Summary</h2>
              <div class="stats-grid">
                ${Object.entries(data.stats)
                  .slice(0, 4)
                  .map(
                    ([key, value]: [string, any], i: number) => `
                    <div class="stat-card ${i === 0 ? "primary" : ""}">
                      <div class="stat-value">${typeof value === "number" ? value.toLocaleString("en-IN") : value}</div>
                      <div class="stat-label">${key.replace(/([A-Z])/g, " $1").trim()}</div>
                    </div>
                  `
                  )
                  .join("")}
              </div>
            </div>
          ` : ""}
          
          ${data.tableData ? `
            <div class="section">
              <h2 class="section-title">Detailed Data</h2>
              <table class="data-table">
                <thead>
                  <tr>
                    ${Object.keys(data.tableData[0] || {})
                      .map((key) => `<th>${key.replace(/([A-Z])/g, " $1").trim()}</th>`)
                      .join("")}
                  </tr>
                </thead>
                <tbody>
                  ${data.tableData
                    .slice(0, 10)
                    .map(
                      (row: any) => `
                      <tr>
                        ${Object.values(row)
                          .map((val: any) => `<td>${typeof val === "number" ? val.toLocaleString("en-IN") : val}</td>`)
                          .join("")}
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          ` : ""}
          
          ${data.insights ? `
            <div class="section">
              <h2 class="section-title">AI-Generated Insights</h2>
              ${data.insights
                .map(
                  (insight: string) => `
                  <div class="insight-box">
                    <p>${insight}</p>
                  </div>
                `
                )
                .join("")}
            </div>
          ` : ""}
          
          <div class="footer">
            <p class="confidential">CONFIDENTIAL - For Internal Use Only</p>
            <p>Aadhaar Analytics Platform © ${new Date().getFullYear()} | Unique Identification Authority of India</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();

      // Wait for fonts and content to load before printing
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    },
    []
  );

  const exportToPdf = useCallback(
    async (options: ExportOptions, data: any) => {
      setIsExporting(true);
      try {
        generatePdfContent(options, data);
      } catch (error) {
        console.error("PDF export failed:", error);
        throw error;
      } finally {
        setIsExporting(false);
      }
    },
    [generatePdfContent]
  );

  return {
    exportToPdf,
    isExporting,
  };
}
