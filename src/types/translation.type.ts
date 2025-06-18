export type LangMessage = {
	success: string;
	dataSaved: string;
	dataDeleted: string;
	emailExist: string;
	emailNotExist: string;

	httpUnauthorized: string; // 401
	httpForbidden: string; // 403
	httpNotFound: string; // 404
	httpInternalServerError: string; // 500
}