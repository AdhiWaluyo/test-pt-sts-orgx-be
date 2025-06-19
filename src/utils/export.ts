import XLSX from "xlsx";
import { Response } from "express";

export const exportToExcel = async (
	res: Response,
	filename: string,
	data: any[]
) => {
	const worksheet = XLSX.utils.json_to_sheet(data);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

	const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

	res.setHeader(
		"Content-Type",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	);
	res.setHeader(
		"Content-Disposition",
		`attachment; filename="${filename}.xlsx"`
	);
	res.send(buffer);
};
