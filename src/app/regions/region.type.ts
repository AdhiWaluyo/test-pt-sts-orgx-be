// Region type
export interface RegionInput {
	name: string,
	description?: string,
	type: number,
	province_id?: number,
	city_id?: number,
	district_id?: number,
}