export enum regionEnum {
	PROVINCE = 1,
	CITY = 2,
	DISTRICT = 3,
	VILLAGE = 4,
}

export const regionEnumString: Record<regionEnum, string> = {
	[regionEnum.PROVINCE]: "province",
	[regionEnum.CITY]: "city",
	[regionEnum.DISTRICT]: "district",
	[regionEnum.VILLAGE]: "village",
};
