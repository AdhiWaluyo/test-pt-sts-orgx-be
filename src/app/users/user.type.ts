// User type
export interface UpdateUserInput {
	roleId: number,
	regionId: number,
}

// Create user type
export interface CreateUserInput extends UpdateUserInput {
	username: string,
	password: string;
}