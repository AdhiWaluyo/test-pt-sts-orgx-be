export interface MemberInput {
	name: string;
	nik: string;
	phone: string;
	provinceId: number;
	cityId: number;
	districtId: number;
	villageId: number;
	accessLevel?: number;
}