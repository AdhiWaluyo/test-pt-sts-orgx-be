import jwt, { JwtPayload } from 'jsonwebtoken';
import { v7 as uuidv7 } from 'uuid';
import bcrypt from 'bcrypt';
import db from "@/utils/db.server";
import { LoginInput, RegisterInput, User } from "./auth.type";
import { isEmpty } from "@/utils/helper";
import dayjs from 'dayjs';
import { ErrorCode } from '@/enums/erro-code.enum';


/**
 * Login result
 */
type LoginResult =
	| { success: true; user: User }
	| { success: false; errorCode: ErrorCode };

/**
 * Login with username and password
 * @param {LoginInput} data - login data
 * @returns {Promise<LoginResult>} - user data or null if not found or incorrect password
 */
const login = async (data: LoginInput): Promise<LoginResult> => {

	// Check if user exists
	const user = await db.user.findFirst({
		where: {
			username: data.username,
			deletedAt: null
		},
		select: {
			id: true,
			username: true,
			password: true,
			isActive: true
		}
	});

	// If user not found, return null
	if (isEmpty(user)) {
		return {
			success: false,
			errorCode: ErrorCode.DATA_NOT_FOUND,
		};
	}

	// If user is not active, return null
	if (!user?.isActive) {
		return {
			success: false,
			errorCode: ErrorCode.DATA_INACTIVE,
		};
	}

	// Check if password is correct
	const passwordMatch = await bcrypt.compare(data.password, user?.password as string);

	// If password is incorrect, return null
	if (!passwordMatch) {
		return {
			success: false,
			errorCode: ErrorCode.INCORRECT_CREDENTIALS,
		};
	}

	return { success: true, user };
}

/**
 * Register a new user
 * @param {RegisterInput} data - register data
 * @returns {Promise<User>} - registered user
 */
const register = async (data: RegisterInput) => {

	// Hash password
	const hashedPassword = await bcrypt.hash(data.password, 12);

	// Create user
	const user = await db.user.create({
		data: {
			username: data.username,
			password: hashedPassword,
			provinceId: data.provinceId,
			cityId: data.cityId,
			districtId: data.districtId,
			villageId: data.villageId,
		},
		select: {
			id: true,
			username: true,
			createdAt: true,
			updatedAt: true,
		}
	});

	return user;
}

/**
 * Generates an access token for a given user.
 * @param {User} user - User object to generate the access token for
 * @returns {Promise<{token: string, expiresAt: Dayjs, jti: string}>} - Generated access token and its expiration date
 */
export const generateAccessToken = async (user: User) => {

	// Default to 1 hour
	const expiresInHours = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '1');

	// Calculate expiration date
	const expiresAt = dayjs().add(expiresInHours, 'hour');

	// Convert Dayjs to Date
	const expiresAtDate = expiresAt.toDate();

	// Create access token
	const accessToken = await db.accessToken.create({
		data: {
			id: uuidv7(),
			userId: user.id,
			expiresAt: expiresAtDate,
			revoked: false,
		},
	});

	// Create JWT payload
	const payload: JwtPayload = {
		jti: accessToken.id,
		sub: accessToken.userId.toString(),
		exp: Math.floor(expiresAt.unix()),
	};

	// Sign JWT
	const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string);

	// Return access token
	return {
		token,
		expiresAt,
		jti: accessToken.id,
	};
};

/**
 * Verifies the given access token.
 *
 * Decodes the JWT token using the secret and checks if the corresponding access token
 * exists in the database, is not revoked, and has not expired.
 *
 * @param {string} token - The JWT access token to verify.
 * @returns {Promise<JwtPayload | null>} - The decoded JWT payload if the token is valid; otherwise, null.
 */
export const verifyAccessToken = async (token: string) => {

	// Decode JWT
	const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;

	// Check if access token exists
	const accessToken = await db.accessToken.findFirst({
		where: {
			id: decoded.jti,
			userId: parseInt(decoded.sub as string),
			expiresAt: {
				gt: new Date,
			},
			revoked: false,
		},
		select: {
			id: true,
		}
	});

	// If access token does not exist, return null
	if (!accessToken) {
		return null;
	}

	return decoded;
};

/**
 * Logout / revoke access token
 * @param {string} id - Token ID to revoke
 * @returns {Promise<boolean>} - true if success
 */
const logout = async (id: string): Promise<boolean> => {
	const accessToken = await db.accessToken.updateMany({
		where: {
			id,
			revoked: false,
		},
		data: {
			revoked: true,
		},
	});

	return accessToken.count > 0;
};


// Export
const authService = {
	login,
	register,
	generateAccessToken,
	verifyAccessToken,
	logout
}

export default authService;

