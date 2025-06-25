import { Response } from "express";
import memberService from "./member.service";
import { messages } from "@/lang";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { transformMember } from "./member.tranformer";
import { AuthenticatedRequest } from "general.type";

const list = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { members, meta } = await memberService.list(req.user?.id as number, req.query);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: members,
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
		const member = await memberService.getOne(parseInt(req.params.id));

		if (!member) {
			res.status(HttpStatusCode.NotFound).json({
				message: messages.httpNotFound
			});
			return
		}

		const transformedMember = transformMember(member);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedMember,
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
		const member = await memberService.create(req.body, req.user);

		const transformedMember = transformMember(member);

		res.status(HttpStatusCode.Created).json({
			message: messages.dataSaved,
			data: transformedMember,
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
		const isExists = await memberService.isExists(parseInt(req.params.id));

		if (!isExists) {
			res.status(HttpStatusCode.NotFound).json({
				message: messages.httpNotFound,
			});
			return
		}

		const member = await memberService.update(parseInt(req.params.id), req.body);

		const transformedMember = transformMember(member);

		res.status(HttpStatusCode.Ok).json({
			message: messages.dataSaved,
			data: transformedMember,
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
		const isExists = await memberService.isExists(parseInt(req.params.id));

		if (!isExists) {
			res.status(HttpStatusCode.NotFound).json({
				message: messages.httpNotFound,
			});
			return
		}

		await memberService.remove(parseInt(req.params.id));

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

const memberController = {
	list,
	getOne,
	create,
	update,
	remove,
}

export default memberController; 