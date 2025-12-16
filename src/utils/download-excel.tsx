import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel<T extends object>(data: T[], fileName: string) {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Convert JSON → Worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create Workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Workers");

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Save file
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
}
