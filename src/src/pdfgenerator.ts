import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import ejs from "ejs";

export const generatePDF = async (labResult: any): Promise<string> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load EJS Template
  const templatePath = path.join(__dirname, "views", "labReport.ejs");
  const template = fs.readFileSync(templatePath, "utf8");
  const html = ejs.render(template, { labResult });

  await page.setContent(html);
  const pdfPath = path.join(__dirname, `Lab_Report_${labResult.id}.pdf`);
  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();
  return pdfPath;
};
