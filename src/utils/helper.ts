export const calculatePagination = (rawPage: string, rawPerPage: string) => {
	let page = parseInt(rawPage, 10);
	let perPage = parseInt(rawPerPage, 10);

	if (isNaN(perPage) || perPage <= 0) {
		perPage = 15;
	}

	if (isNaN(page) || page <= 0) {
		page = 1;
	}

	const offset = (page - 1) * perPage;

	return { page, perPage, offset };
}

export const calculateTotalPage = (totalData: number, perPage: number): number => {
	return totalData < 0 || perPage <= 0
		? 0
		: Math.ceil(totalData / perPage);
}

export const httpResponse = {
	authFailed() {
		return {
			message: "Unauthenticated",
		};
	},
	forbidden() {
		return {
			message: "Forbidden",
		};
	},
	notFound() {
		return {
			message: "Resource not found",
		};
	},
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isEmpty(value: any): boolean {
	// Check for null or undefined
	if (value == null) {
		return true
	};

	// Check for an empty string
	if (typeof value === 'string' && value.trim() === "") {
		return true
	};

	// Check for an empty array
	if (Array.isArray(value) && value.length === 0) {
		return true
	};

	// Check for an empty object
	if (typeof value === 'object' && Object.keys(value).length === 0) {
		return true
	};

	// If none of the above, return false
	return false;
}

export function isNotEmpty(value: any): boolean {
	// Check for null or undefined
	if (value == null) {
		return false
	};

	// Check for a non-empty string
	if (typeof value === 'string' && value.trim() !== "") {
		return true
	};

	// Check for a non-zero number (since `0` is falsy but we may want it considered as not empty)
	if (typeof value === 'number' && !isNaN(value) && value !== 0) {
		return true;
	}

	// Check for a non-empty array
	if (Array.isArray(value) && value.length > 0) {
		return true
	};

	// Check for a non-empty object
	if (typeof value === 'object' && Object.keys(value).length > 0) {
		return true
	};

	// If none of the above, assume the value is not empty
	return false;
}

export const arrayIntersection = (firstArray: any[], secondArray: any[]) => {
	const set1 = new Set(firstArray);

	return secondArray.filter(item => set1.has(item));
}

export const arrayDifference = (arr1: any[], arr2: any[]) => {
	const set2 = new Set(arr2);

	const difference = arr1.filter(item => !set2.has(item));

	return difference;
}

export const pluck = (array: any, keys: string): any[] => {
	let values = array;

	keys.split('.').forEach((key) => {
		let tempValues: any[] = [];

		values.forEach((value: any) => {
			if (value[key] !== 'undefined') {
				tempValues = tempValues.concat(value[key]);
			}
		});

		values = tempValues;
	});

	return values;
}

export const hasPermissions = (guardPermissionIds: string[], userPermissionIds: string[] = []) => {
	const permissionIds = arrayIntersection(guardPermissionIds, userPermissionIds);

	return permissionIds.length > 0;
}

export const hasRoles = (guardRoleIds: number[], userRoleIds: number[] = []) => {
	const roleIds = arrayIntersection(guardRoleIds, userRoleIds);
	return roleIds.length > 0;
};


export const formatPrismaTime = (time: string) => {
	return new Date(`1970-01-01T${time}:00Z`);
}

export const subMinutes = (date: Date, minutes: number): Date => {
	return new Date(date.getTime() - minutes * 60 * 1000);
}