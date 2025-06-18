import { Request } from "express";

export interface CurrentUser {
	id: number;
	accessTokenId: string;
}

export interface AuthenticatedRequest extends Request {
	user?: CurrentUser
}