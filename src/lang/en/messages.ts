import { LangMessage } from "@/types/translation.type";

const messages: LangMessage = {
	success: 'Success',
	dataSaved: 'Data saved successfully.',
	dataDeleted: 'Data deleted successfully',
	emailExist: 'Email already in use',
	emailNotExist: 'Email does not exist',

	// HTTP
	httpUnauthorized: 'Unauthorized',
	httpForbidden: 'Forbidden',
	httpNotFound: 'Resource not found',
	httpInternalServerError: 'Internal server error',
}

export default messages;