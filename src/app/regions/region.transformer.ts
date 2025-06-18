export const transformRegion = (region: any) => {

	return {
		id: region.id,
		name: region.name,
		type: region.type,
		provinceId: region.provinceId,
		cityId: region.cityId,
		districtId: region.districtId,
		createdAt: region.createdAt,
		updatedAt: region.updatedAt,
	}
}