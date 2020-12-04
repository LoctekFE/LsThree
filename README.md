# LsThree
一款基于threejs帮你制作3D模型的库
你只需要传入简单的一些参数就能绘制出图形，光源渲染器相机什么的统统不用你管（当然你还是可以配置的~）

## 安装
	 yarn install
## 快速上手
```html
<script src="./LsThree-0.0.1.js"></script>
<div id="app"></div>

// 你只需要几行代码就能展示出一个3D模型，并且只需要调用简单的几个方法就能动态修改这个模型
const topProps = {
    x: -60,
    y: -40,
    width: 120,
    height: 80,
    depth: 3,
    radius: 5,
};

const tableModel = new LsThree({
    helper: true
}).mount("app");

const defaultMaterial = {
    url: './assets/m1.jpg',
}

tableModel.createTopMaterial(defaultMaterial).then(() => {
    tableModel.renderTableTop(topProps, 'default')
})

// 当然你如果只是为了展示，那一行代码你就能搞定

new LsThree({
    helper: true
}).mount("app").createTopMaterial({
    url: './assets/m1.jpg',
}).then((tableModel) => {
    tableModel.renderTableTop({
        x: -60,
        y: -40,
        width: 120,
        height: 80,
        depth: 3,
        radius: 5,
    }, 'default')
})
```
## 基础功能
- [x] Scene
- [x] Camera
- [x] Renderer
- [x] UV计算
- [x] 打孔
- [x] 基础模型('default', 'bridge')
- [x] 键盘鼠标控制视角

## 增强
- [x] webpack + typescript 封装
- [ ] 打包后canvas加载图片跨域问题 
- [ ] 参数声明
- [ ] 更多模型
	- [ ] 控制台
	- [ ] 桌脚
	- [ ] 圆柱
	- [ ] 不规则
	...
