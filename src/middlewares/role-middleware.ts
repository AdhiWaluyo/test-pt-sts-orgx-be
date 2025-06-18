import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "general.type";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { messages } from "@/lang";
import currentUserService from "@/app/current-user/current-user.service";

/**
 * Role middleware for checking if the user has one of the allowed roles.
 * @param requiredRoleIds Array of allowed role IDs
 */
export const roleMiddleware = (requiredRoleIds: number[]) => {
	return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(HttpStatusCode.Unauthorized).json({ message: messages.httpUnauthorized });
				return;
			}

			const user = await currentUserService.getUserById(userId);

			if (!user || typeof user.roleId !== 'number') {
				res.status(HttpStatusCode.Forbidden).json({ message: messages.httpForbidden });
				return;
			}

			if (!requiredRoleIds.includes(user.roleId)) {
				res.status(HttpStatusCode.Forbidden).json({ message: messages.httpForbidden });
				return;
			}

			next();
		} catch (err) {
			console.error("role middleware error:", err);
			res.status(HttpStatusCode.InternalServerError).json({ message: messages.httpInternalServerError });
		}
	};
};
