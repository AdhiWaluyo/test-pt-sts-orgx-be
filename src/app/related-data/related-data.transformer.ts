
export const transformRelatedData = (relatedData: any) => {

	return {
		id: relatedData.id,
		name: relatedData.name,
		children: relatedData.children?.map(transformRelatedData) ?? [],
	}
}

// export const transformRelatedDataList = (relatedDataList: any) => {
// 	return relatedDataList.map(transformRelatedData);
// }

export const transformRelatedDataRegion = (relatedDataRegion: any) => {

	return {
		id: relatedDataRegion.id,
		name: relatedDataRegion.name,
		provinceId: relatedDataRegion.provinceId,
		cityId: relatedDataRegion.cityId,
		districtId: relatedDataRegion.districtId,
		villageId: relatedDataRegion.villageId,
		children: relatedDataRegion.children?.map(transformRelatedDataRegion) ?? [],
	}
}