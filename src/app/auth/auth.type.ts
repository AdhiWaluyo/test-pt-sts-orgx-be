// User interface
export interface User {
	id: number;
	username: string;
	password: string;
}

// Login interface
export interface LoginInput {
	username: string;
	password: string;
}

// Register interface
export interface RegisterInput {
	name: string;
	username: string;
	phoneNumber?: string;
	password: string;
}