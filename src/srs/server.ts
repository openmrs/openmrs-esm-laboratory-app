import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { generatePDF } from "./pdfGenerator";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sample Lab Results Data
const labResults = [
  { id: 1, patientName: "John Doe", testName: "Blood Test", result: "Normal", reportType: "Summary" },
  { id: 2, patientName: "Jane Smith", testName: "X-Ray", result: "Fracture detected", reportType: "Detailed" }
];

// API to list available lab results
app.get("/lab-results", (req, res) => {
  res.json(labResults);
});

// API to generate and download PDF
app.post("/print", async (req, res) => {
  const { id } = req.body;
  const selectedResult = labResults.find((result) => result.id === id);

  if (!selectedResult) {
    return res.status(404).json({ message: "Lab result not found" });
  }

  const pdfPath = await generatePDF(selectedResult);
  res.download(pdfPath);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
