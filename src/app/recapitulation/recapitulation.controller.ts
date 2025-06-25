import { AuthenticatedRequest } from "general.type";
import { Response } from "express";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { messages } from "@/lang";
import recapitulationService from "./recapitulation.service";
import { transformRecapitulation } from "./recapitulation.transformer";
import { exportToExcel } from "@/utils/export";

const list = async (req: AuthenticatedRequest, res: Response) => {
	try {

		const { data, meta } = await recapitulationService.getWilayahSummaryByUser(req.user?.id as number, req.query);

		const isVillageLevel = data.length > 0 && (data[0] as { nik: string }).nik;

		const transformedRecapitulation = isVillageLevel
			? data.map(transformRecapitulation)
			: data;

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedRecapitulation,
			meta,
		})
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const exportFile = async (req: AuthenticatedRequest, res: Response) => {
	try {

		const result = await recapitulationService.list(
			req.user?.id as number,
			req.query,
			req.query.regionId ? Number(req.query.regionId) : undefined,
			req.query.regionType ? Number(req.query.regionType) : undefined,
		);

		let exportData: any[] = [];

		exportData = result.members.map((item: any) => ({
			No: item.no,
			Nama: item.name,
			NIK: item.nik,
			"No. HP": item.phone,
			Provinsi: item.province?.name,
			Kabupaten: item.city?.name,
			Kecamatan: item.district?.name,
			Kelurahan: item.village?.name,
			"Tanggal Daftar": new Date(item.createdAt).toLocaleDateString("id-ID")
		}));

		// if (level === "village") {
		// 	// Detail format untuk kelurahan
		// 	exportData = result.data.map((item: any) => ({
		// 		Nama: item.name,
		// 		NIK: item.nik,
		// 		"No. HP": item.phone,
		// 		Provinsi: item.province?.name,
		// 		Kabupaten: item.city?.name,
		// 		Kecamatan: item.district?.name,
		// 		Kelurahan: item.village?.name,
		// 		"Tanggal Daftar": new Date(item.createdAt).toLocaleDateString("id-ID")
		// 	}));
		// } else {
		// 	// Format rekap summary untuk wilayah
		// 	exportData = result.data.map((item: any) => ({
		// 		No: item.no,
		// 		"Nama Wilayah": item.name,
		// 		"Total Anggota": item.total
		// 	}));
		// }

		// Export ke Excel
		// await exportToExcel(res, `rekap-${level}`, exportData);

		await exportToExcel(res, `rekap-wilayah`, exportData);

	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Gagal export rekap" });
	}
};


const recapitulationController = {
	list,
	exportFile
};

export default recapitulationController;
