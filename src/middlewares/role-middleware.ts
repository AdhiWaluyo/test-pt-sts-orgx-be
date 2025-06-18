import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "general.type";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { messages } from "@/lang";
import currentUserService from "@/app/current-user/current-user.service";
import { hasRoles } from "@/utils/helper";

export const roleMiddleware = (requiredRoleIds: number[]) => {
	return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(HttpStatusCode.Unauthorized).json({ message: messages.httpUnauthorized });
				return;
			}

			const userRoleIds = await currentUserService.getUserRoleIds(userId);
			const hasAccess = hasRoles(requiredRoleIds, userRoleIds);

			if (!hasAccess) {
				res.status(HttpStatusCode.Forbidden).json({ message: messages.httpForbidden });
				return;
			}

			next();
		} catch (err) {
			console.error("role middleware error:", err);
			res.status(HttpStatusCode.InternalServerError).json({ message: messages.httpInternalServerError });
			return;
		}
	};
};
