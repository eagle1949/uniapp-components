const colors = [
  "#E0FFFF",
  "#C4F1FF",
  "#A7E3FF",
  "#8BDAFF",
  "#6ECCFF",
  "#52C4FF",
  "#35B6FF",
  "#19ADFF",
  "#009FFF",
  "#006EDD"
];


// size 1-99 1-999 1-9999
export const getMapColor = (size, num) =>{
	let minSize = size / 10;
	let index = Math.floor(num/ minSize);
	
	if(index>=9){
		index = 9;
	}
	return colors[index];
}


// map 地图
// depth 层级 adcode 行政区划 arrData 返回数据  size 100， 1000， 10000
export const setMapArea = (map, depth, adCode, arrData, size) =>{
	// function (properties) {
	// 	// properties为可用于做样式映射的字段，包含
	// 	// NAME_CHN:中文名称
	// 	// adcode_pro
	// 	// adcode_cit
	// 	// adcode
	// 	let color = '#E0FFFF';
	// 	arrData.forEach(item=>{
	// 		if(item.ORGID == properties.adcode){
	// 			color =  getMapColor(size, item.TOTAL);
	// 		}
	// 	})
	// 	return color;
	// }
	map.setBorderStyle({
		adCode: adCode,
		depth: depth,  // 1 市  2 县
		style: {
			size: size,
			'fill': 'white',
			'fillData': arrData,
			'province-stroke': 'cornflowerblue',
			'city-stroke': '#014FA3', // 中国地级市边界
			'county-stroke': depth==1? 'grep': '#014FA3' // 中国区县边界
		}
	})
}