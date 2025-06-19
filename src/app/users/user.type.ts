// User type
export interface UpdateUserInput {
	roleId: number,
	provinceId: number,
	cityId: number,
	districtId: number,
	villageId: number
}

// Create user type
export interface CreateUserInput extends UpdateUserInput {
	username: string,
	password: string;
}