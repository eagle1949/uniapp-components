# uniapp renderjs Map 使用

## 引用
```
import Map from 'umap-gd';

components: {
	Map
},
```

## 地图使用
```
<Map ref="MyMap" @mapClick="mapClick"></Map>

mounted(){
	// 地图渲染，定义map 操作对应高德地图  map 可以传入到子集
	setTimeout(()=>{
		this.map = this.$refs.MyMap;						
	}, 1000)
},
```

## setCenter  设置中心点  
```
this.$refs.MyMap.setCenter([this.userInfo.SSSFJD, this.userInfo.SSSFWD]);
```
## setZoom  设置层级
```
this.$refs.MyMap.setZoom(6);
```	

## setMapStyle 设置地图样式
```
this.$refs.MyMap.setMapStyle('amap://styles/whitesmoke');
``` 

## setLayers true 设置影像图，false 取消影像图
```
this.$refs.MyMap.setLayers(true);
``` 

## setLocationPoint  定位渲染
```
this.$refs.MyMap.setLocationPoint({
	lng: address.longitude,  // 经度
	lat: address.latitude   // 纬度
})
```

## addHtmlMarkers 传html地图渲染
type 类型，对应点击的时候，可以判断是点击了什么类型
longitude 经度
latitude 纬度
content html内容
```
this.areaData.yhList.forEach(item=>{
	item.type = 'people_list';
	item.longitude = item.JD;
	item.latitude = item.WD;
	item.content =  `<div class="zy1229-site2">
			<div class="ic peopleIcon"></div>
		</div>`
})

this.map.addHtmlMarkers(this.areaData.yhList);
```

```
this.map.addHtmlMarkers([{
	type: 'people_list',
	longitude: '',
	latitude: '',
	content: ''
}]);
```


## 点击事件 (mapClick)  
配合前面 type 使用，比如type 是 people_list 人员列表
```
<Map ref="MyMap" @mapClick="mapClick"></Map>

methods: {
	mapClick(e){
		<!-- {
			type: 'people_list',
			longitude: '',
			latitude: '',
			content: ''
		} -->
	}
}

```

