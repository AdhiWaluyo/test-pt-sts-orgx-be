import authService from '@/app/auth/auth.service';
import { HttpStatusCode } from '@/enums/http-status-code.enum';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'general.type';

export const authMiddleware = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res
			.status(HttpStatusCode.Unauthorized)
			.json({ message: 'Unauthorized' });
		return;
	}

	const token = authHeader.split(' ')[1];

	try {
		const jwtPayload = await authService.verifyAccessToken(token);

		if (!jwtPayload) {
			res
				.status(HttpStatusCode.Unauthorized)
				.json({ message: 'Unauthorized' });
			return;
		}

		req.user = {
			id: parseInt(jwtPayload.sub as string),
			accessTokenId: jwtPayload.jti as string,
		};

		next();
	} catch (err) {
		res
			.status(HttpStatusCode.Unauthorized)
			.json({ message: 'Unauthorized' });
	}
};
