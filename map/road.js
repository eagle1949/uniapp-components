import axios from 'axios'

import * as turf1 from '@turf/turf'
let lastLng = null;
let lastLat = null;

import {
	WEB_URL
} from '@/common/configBaseUrl.js';

let BASE_URL = '/ydzfsx'
// #ifdef APP-PLUS
BASE_URL = WEB_URL + 'ydzfsx'
// #endif


const getRoadApi = data => {
	return axios.request({
		method: 'post',
		url: BASE_URL + '/mobile/yszf/getRouteList',
		data: {
			"WRYBH": data.pollutionId,
			"startX": data.path[0][0],
			"startY": data.path[0][1],
			"endX": data.path[1][0],
			"endY": data.path[1][1]
		}
	})
}




// 判断道路是否偏移
function checkOffset(self) {
	let address = self.oldAddressObj;
	let currentLocation = [address.lng, address.lat]
	let route = self.roadWalkArr;

	if (self.roadWalkArr.length > 0) {
		// var distance = AMap.GeometryUtil.distanceToLine(currentLocation, route);
		// console.log(distance, 'distance');
		var pt = turf1.point(currentLocation);
		// console.log(currentLocation);

		var line = turf1.lineString(route);
		// console.log(route);

		var distance = turf1.pointToLineDistance(pt, line, {
			units: 'miles'
		}) * 1609.344;
		// console.log(distance, 'distance');

		if (distance > 10) {
			// self.$ownerInstance.callMethod('onViewClick', {
			// 	type: 'voice',
			// 	content: '您已偏航，重新为您规划路线'
			// });
		}

		return distance > 10;
	} else {
		return true;
	}
}

function getOldRoad(self) {
	let newA = [];
	let currentIndex = 0;
	for (let i = 0; i < self.roadWalkArr.length; i++) {
		if (self.roadWalkArr[i][0] == lastLng && self.roadWalkArr[i][1] == lastLat) {
			currentIndex = i - 1;
		}
	}
	self.roadWalkArr.forEach((i, idx) => {
		if (idx >= currentIndex) {
			newA.push(i);
		}
	})
	self.line.setPath(newA);
}


// 获取自研算法导航
const getSelfRoad = (roadPollutionId, path, path1, pointData, self) => {
	// 判断偏移
	// let isOffset = checkOffset(self);

	// if (!isOffset) {
	// 	getOldRoad(self, path);
	// 	return;
	// }

	getRoadApi({
		pollutionId: roadPollutionId,
		// path: [path[1], path[1]],  // 测试异常问题
		path: [path[0], path[1]]
	}).then(res => {
		// console.log(res, 'res');
		self.roadWalkArr = [];
		// console.log(res.data, 'ResData');
		if (res.data.status_code == '0') {
			// console.log(res.data.data_json);
			if (res.data.data_json.length == 0) {
				// self.map.remove(self.line);
				self.line.setPath([path[0], path[1]])
				self.map.remove(self.startLine);
				self.map.remove(self.endLine);
				self.startLine = null;
				self.endLine = null;
			}


			res.data.data_json.reverse();
			let newPath = [];
			// newPath.push(path[0]);

			res.data.data_json.forEach(it => {
				newPath.push([parseFloat(it.longitude), parseFloat(it.latitude)]);
				// self.roadWalkArr.push([parseFloat(it.longitude), parseFloat(it.latitude)]);
			})

			// 末端坐标添加
			// if (pointData.MDZB && pointData.MDZB.length > 0) {
			// 	// pointData.MDZB.forEach(md => {
			// 	// 	newPath.push([parseFloat(md.JD), parseFloat(md.WD)]);
			// 	// })

			// 	newPath.push([parseFloat(pointData.MDZB[0].JD), parseFloat(pointData.MDZB[0].WD)]);
			// }

			if (newPath.length > 0) {
				if (newPath[newPath.length - 1] != path1) {
					// newPath.push(path1);

					self.endLine.setPath([newPath[newPath.length - 1], path1]);
					// self.roadWalkArr.push(path1);
				}
			}

			self.roadWalkArr = newPath;


			if (newPath.length > 0) {
				self.startLine.setPath([path[0], newPath[0]]);
			}

			if (newPath.length > 1) {
				self.line.setPath(newPath);
			} else {
				// self.startLine.setPath(null);
				// self.line.setPath(null);
			}
			//
		}
	})
}


// 获取高德地图导航
const getGDRoad = (path, path1, pointData, self) => {
	var walkingOption = {}
	// 步行导航
	var walking = new AMap.Walking(walkingOption)

	// 判断偏移
	// let isOffset = checkOffset(self);

	// if (!isOffset) {
	// 	getOldRoad(self, path);
	// 	return;
	// }

	// 1. 判断是否在原来的线路偏移范围之内，偏移超过5米，重新划线，偏移后，提醒然后重新导航规划
	// 2. 如果是偏移范围内，就用之前的搜索的导航，找到离导航最近的点，重新划线  （待定）

	walking.search(path[0], path[1], function(status, result) {
		// 末端经纬度确认，如果有末端经纬度，就按照末端经纬度第一个经纬度导航
		self.roadWalkArr = [];
		// result即是对应的步行路线数据信息，相关数据结构文档参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
		if (status === 'complete') {
			if (result.routes && result.routes.length) {
				// drawRoute(result.routes[0])
				function parseRouteToPath(route) {
					var newPath = []


					// newPath.push(path[0])

					for (var i = 0, l = route.steps.length; i < l; i++) {
						var step = route.steps[i]

						for (var j = 0, n = step.path.length; j < n; j++) {
							newPath.push(step.path[j])
							// self.roadWalkArr.push(step.path[j]);
						}
					}

					// 末端坐标添加
					if (pointData.MDZB && pointData.MDZB.length > 0) {
						// pointData.MDZB.forEach(md => {
						// 	newPath.push([parseFloat(md.JD), parseFloat(md.WD)]);
						// })

						newPath.push([parseFloat(pointData.MDZB[0].JD), parseFloat(pointData.MDZB[0].WD)]);

						// self.roadWalkArr.push([parseFloat(pointData.MDZB[0].JD), parseFloat(pointData.MDZB[
						// 	0].WD)]);
					}

					if (newPath.length > 0) {
						if (newPath[newPath.length - 1] != path1) {
							// newPath.push(path1);

							self.endLine.setPath([newPath[newPath.length - 1], path1]);
							// self.roadWalkArr.push(path1);
						}
					}


					return newPath;
				}
				// console.log(result.routes)
				var routePath = parseRouteToPath(result.routes[0])

				// console.log(routePath);
				self.roadWalkArr = JSON.parse(JSON.stringify(routePath));


				// self.line.setPath(routePath);

				// console.log(routePath);

				if (routePath.length > 0) {
					self.startLine.setPath([path[0], self.roadWalkArr[0]]);
				}

				if (routePath.length > 1) {
					self.line.setPath(routePath);
				}
				// log.success('绘制步行路线完成')
			}
		} else {
			console.log('步行路线数据查询失败' + result)
		}
	});
}



// 道路叠加
const renderRoad = (roadPollutionId, self) => {

	axios.request({
		method: 'post',
		url: BASE_URL + '/mobile/yszf/getQyGisData',
		data: {
			WRYBH: roadPollutionId
		}
	}).then(res => {

		if (!res.data.data_json) {
			return;
		}

		let RoadJSON = JSON.parse(res.data.data_json.QYLJSJ);
		// console.log(RoadJSON);
		var geojson = new AMap.GeoJSON({
			geoJSON: RoadJSON,
			// 还可以自定义getMarker和getPolyline
			getPolyline: function(geojson, lnglats) {
				// console.log(lnglats);
				return new AMap.Polyline({
					path: lnglats,
					fillOpacity: 1, // 面积越大透明度越高
					strokeColor: '#DADACD',
					lineJoin: 'round',
					lineCap: 'round',
					strokeOpacity: 0.9, //线透明度	
					strokeWeight: 5
				});
			}
		});
		self.map.add(geojson);
	})

	// axios.request({
	// 	method: 'get',
	// 	url: BASE_URL + '/resources/roadgrid/' + roadPollutionId + '.json',
	// }).then(res => {
	// 	let RoadJSON = res.data;
	// 	var geojson = new AMap.GeoJSON({
	// 		geoJSON: RoadJSON,
	// 		// 还可以自定义getMarker和getPolyline
	// 		getPolyline: function(geojson, lnglats) {
	// 			// console.log(lnglats);
	// 			return new AMap.Polyline({
	// 				path: lnglats,
	// 				fillOpacity: 1, // 面积越大透明度越高
	// 				strokeColor: '#DADACD',
	// 				lineJoin: 'round',
	// 				lineCap: 'round',
	// 				strokeOpacity: 0.9, //线透明度	
	// 				strokeWeight: 5
	// 			});
	// 		}
	// 	});
	// 	self.map.add(geojson);
	// })
}





function determineTurn(points, currentIndex) {
	let currentPoint = points[currentIndex];
	let nextPoint = points[currentIndex + 1];
	let afterNextPoint = points[currentIndex + 2];

	if (currentIndex >= points.length - 2) return "无转向";

	let currentBearing = bearing(currentPoint[0], currentPoint[1], nextPoint[0], nextPoint[1]);
	let nextBearing = bearing(nextPoint[0], nextPoint[1], afterNextPoint[0], afterNextPoint[1]);

	let diff = currentBearing - nextBearing;
	// console.log(currentBearing)
	// console.log(nextBearing)

	if (diff > 180) {
		diff -= 360;
	} else if (diff < -180) {
		diff += 360;
	}
	if (Math.abs(diff) <= 30) {
		return "直行";
	} else if (diff > 0) {
		return "左转";
	} else {
		return "右转";
	}

	// if (diff >= 0 && diff <= 45 || diff <= -320) {
	// 	return "直行";
	// } else if (diff > 45 && diff < 180) {
	// 	return "左转";
	// } else if (diff < -45 && diff > -180) {
	// 	return "右转";
	// } else if ((diff >= -320 && diff < -360) || (diff > 320 && diff < 360)) {
	// 	return "左转";
	// } else {
	// 	return "直行";
	// }

	// return diff;
}


function bearing(lon1, lat1, lon2, lat2) {
	// 将角度转换为弧度  
	const rad = Math.PI / 180;
	lat1 *= rad;
	lon1 *= rad;
	lat2 *= rad;
	lon2 *= rad;

	// 计算差值  
	const dLon = lon2 - lon1;

	// 辅助变量  
	let y = Math.sin(dLon) * Math.cos(lat2);
	let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

	// 计算最终的方位角  
	let bearing = Math.atan2(y, x);

	// 将弧度转换回角度  
	bearing = (bearing / rad + 360) % 360;
	console.log(bearing, 'bearing');
	return bearing;
}


function deg2rad(deg) {
	return deg * (Math.PI / 180);
}


// 计算两个点位直接的距离
const calculateDistance = ([lon1, lat1], [lon2, lat2]) => {
	var R = 6371e3; // 地球半径，单位米  
	var dLat = deg2rad(lat2 - lat1);
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var distance = R * c; // 距离，单位米  
	return distance;
}



// 道路语音导航
// const roadVoiceNav = (self) => {
// 	// 如果道路不是语音导航，直接返回
// 	if (self.roadType != 'walk' || self.roadWalkArr.length === 0) {
// 		return;
// 	}

// 	let address = self.oldAddressObj;
// 	let angle = address.oldAngle;
// 	let lng = address.lng;
// 	let lat = address.lat;

// 	let roadWalkArr = self.roadWalkArr;

// 	let isRepeated = false;

// 	// 根据当前位置在路线中的位置来计算下一个点的距离和转向
// 	let currentIndex = 0;
// 	for (let i = 0; i < roadWalkArr.length; i++) {
// 		if (roadWalkArr[i][0] == lastLng && roadWalkArr[i][1] == lastLat) {
// 			currentIndex = i - 1;
// 		}
// 	}

// 	if (currentIndex < 0) {
// 		currentIndex = 0;
// 	}

// 	let distance = 0;
// 	let turnTitle = '直行';
// 	if (currentIndex < roadWalkArr.length - 1) {
// 		distance = calculateDistance([lng, lat], roadWalkArr[currentIndex + 1]);
// 		distance = parseInt(distance);

// 		turnTitle = determineTurn(roadWalkArr, currentIndex);

// 		if (distance < 12 && distance > 0) {
// 			isRepeated = (lastLng === roadWalkArr[currentIndex + 1][0] && lastLat === roadWalkArr[currentIndex + 1][
// 				1
// 			]);
// 			lastLng = roadWalkArr[currentIndex + 1][0];
// 			lastLat = roadWalkArr[currentIndex + 1][1];
// 		}

// 		console.log('前方' + distance + '米' + turnTitle);
// 	}

// 	if (!isRepeated && distance < 12 && distance > 0) {
// 		self.$ownerInstance.callMethod('onViewClick', {
// 			type: 'voice',
// 			content: '前方' + distance + '米' + turnTitle
// 		});
// 	}
// };


const roadVoiceNav = (self) => {
	// console.log(self.roadWalkArr);

	// 如果道路不是语音导航，直接返回
	if (self.roadType != 'walk' || self.roadWalkArr.length == 0) {
		return;
	}

	let address = self.oldAddressObj;
	let angle = address.oldAngle;
	let lng = address.lng;
	let lat = address.lat;

	let roadWalkArr = self.roadWalkArr;
	let turnTitle = determineTurn(roadWalkArr, 0);
	let isRepeated = false;


	// for (let i = 0; i < roadWalkArr.length - 1; i++) {
	// 	console.log(determineTurn(roadWalkArr, i))
	// }


	let distance = 0;
	if (roadWalkArr.length > 1) {
		distance = calculateDistance(roadWalkArr[0], roadWalkArr[1]);
	}

	distance = parseInt(distance);

	if (distance < 20 && distance > 0) {
		isRepeated = (lastLng === roadWalkArr[1][0] && lastLat === roadWalkArr[1][1]);
		lastLng = roadWalkArr[1][0];
		lastLat = roadWalkArr[1][1];
	}

	// console.log('前方' + distance + '米' + turnTitle)

	// 去目标点<25m 那么直接返回，不用语音提示
	// console.log(self.goWayDistance, 'self.goWayDistance')
	if (self.goWayDistance < 25) {
		return;
	}

	if (!isRepeated && distance < 20 && distance > 0) {
		// console.log('前方' + distance + '米' + turnTitle)
		self.$ownerInstance.callMethod('onViewClick', {
			type: 'voice',
			content: '前方' + distance + '米' + turnTitle
		});
	}
}

export default {
	getSelfRoad,
	getGDRoad,
	renderRoad,
	roadVoiceNav
}