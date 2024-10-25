// 渲染生产车间大门
const renderProductDoor = (pointArr, self) => {
	self.map.remove(self.productDoorMarker);
	pointArr.forEach(item => {
		// 常规要素点位
		let offset = new AMap.Pixel(-10, -10);
		if (item.CJDW.JD) {
			let marker = new AMap.Marker({
				zIndex: 4,
				map: self.map,
				position: new AMap.LngLat(parseFloat(item.CJDW.JD), parseFloat(item.CJDW.WD)),
				content: `<div class="pDoorIcon"></div>`,
				extData: item,
				offset: offset
			});

			self.productDoorMarker.push(marker);
		}
	})
}


// 渲染厂界大门
const renderBoundaryDoor = (item, self) => {
	// 常规要素点位
	let offset = new AMap.Pixel(-10, -10);
	if (item.JD) {
		let marker = new AMap.Marker({
			zIndex: 4,
			map: self.map,
			position: new AMap.LngLat(parseFloat(item.JD), parseFloat(item.WD)),
			content: `<div class="sDoorIcon"></div>`,
			extData: item,
			offset: offset
		});
	}
}



export default {
	renderProductDoor,
	renderBoundaryDoor
}