
export enum HttpStatusCode {
	Ok = 200,
	Created = 201,
	NoContent = 204,
	MovedPermanently = 301,
	Found = 302,
	TemporaryRedirect = 307,
	PermanentRedirect = 308,
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	MethodNotAllowed = 405,
	RequestTimeout = 408,
	TooManyRequests = 429,
	InternalServerError = 500,
}