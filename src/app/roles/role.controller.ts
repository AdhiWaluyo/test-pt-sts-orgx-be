import { Response } from "express";
import roleService from "./role.service";
import { messages } from "@/lang";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { transformRole } from "./role.transformer";
import { AuthenticatedRequest } from "general.type";

const list = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { roles, meta } = await roleService.list(req.query);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: roles,
			meta,
		})
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const getOne = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const role = await roleService.getOne(parseInt(req.params.id));

		if (!role) {
			res.status(HttpStatusCode.NotFound).json({
				message: messages.httpNotFound
			});
			return
		}

		const transformedRole = transformRole(role);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedRole,
		});
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const create = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const role = await roleService.create(req.body, req.user);

		const transformedRole = transformRole(role);

		res.status(HttpStatusCode.Created).json({
			message: messages.dataSaved,
			data: transformedRole,
		});
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const update = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const isExists = await roleService.isExists(parseInt(req.params.id));

		if (!isExists) {
			res.status(HttpStatusCode.NotFound).json({
				message: messages.httpNotFound,
			});
			return
		}

		const role = await roleService.update(parseInt(req.params.id), req.body);

		const transformedRole = transformRole(role);

		res.status(HttpStatusCode.Ok).json({
			message: messages.dataSaved,
			data: transformedRole,
		});
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const remove = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const isExists = await roleService.isExists(parseInt(req.params.id));

		if (!isExists) {
			res.status(HttpStatusCode.NotFound).json({
				message: messages.httpNotFound,
			});
			return
		}

		await roleService.remove(parseInt(req.params.id));

		res.status(HttpStatusCode.Ok).json({
			message: messages.dataDeleted
		});
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const roleController = {
	list,
	getOne,
	create,
	update,
	remove,
}

export default roleController; 