import Three from '../lib/index';
import { DefaultSetting, ILsThree, RectTypes } from './interface'

const defaultOptions: DefaultSetting.InitOptions = {
    helper: false
}

class LsThree implements ILsThree {
    options: DefaultSetting.InitOptions;
    renderQueue: { [k: string]: THREE.Mesh } = {};
    objTarget: { [k:string]:any} = {}
    el?: HTMLElement | null;
    topMaterial?: unknown;
    scene = new Three.Scene();
    camera = new Three.Camera();
    renderer = new Three.WebGLRenderer();
    light = new Three.SpotLight();
    props?: RectTypes;
    shapeType?: string;
    topRender?: THREE.Mesh;
    modelGroup = new Three.Object3D();
    controls: any;
    constructor(options: Object) {
        //预处理
        this.options = {...defaultOptions, ...options};
    }

    mount(el: string) {
        this.el = document.getElementById(el)  // 获取父级dom

        if (!this.el) {
            this.el = document.body
            console.warn('[Table render] function mount param must require dom id, or will mount body')
        }

        this.createScene();    // 创建场景
        this.createCamera();   // 创建相机
        this.createLight();    // 创建光源
        this.createRenderer(); // 创建renderer

        return this
    }

    createTopMaterial(options: DefaultSetting.MaterialOptions) {

        let clipPlanes: Array<THREE.Plane> = []
        let steps = 30
        let r = 0
        if (options.hole) {
            if (!options.hole.x || !options.hole.y || !options.hole.r) {
                console.warn('[Table Mater] params need {x, y, r}')
            }
            else {
                r = options.hole.r
                for (let i = 0; i <= steps; i++) {
                    const rx = i / steps;
                    const ry = Math.sqrt(1 - rx * rx)
                    clipPlanes.push(new Three.Plane(new Three.Vector3(-rx, 0, ry), -r).translate(new Three.Vector3(options.hole.x, 0, options.hole.y)))
                    clipPlanes.push(new Three.Plane(new Three.Vector3(rx, 0, ry), -r).translate(new Three.Vector3(options.hole.x, 0, options.hole.y)))
                    clipPlanes.push(new Three.Plane(new Three.Vector3(-rx, 0, -ry), -r).translate(new Three.Vector3(options.hole.x, 0, options.hole.y)))
                    clipPlanes.push(new Three.Plane(new Three.Vector3(rx, 0, -ry), -r).translate(new Three.Vector3(options.hole.x, 0, options.hole.y)))
                }
            }
        }
        return new Promise((resolve: Function) => {
            Three.ImageLoader.prototype.setCrossOrigin('anonymous')
            new Three.ImageLoader().load(options.url, (img: unknown) => {
                let texture = new Three.Texture(img);
                texture.needsUpdate = true;
                this.topMaterial = new Three.MeshBasicMaterial({
                    map: texture,
                    side: Three.DoubleSide,
                    // wireframe: true,
                    clippingPlanes: clipPlanes,
                    clipIntersection: {
                        clipIntersection: true,
                        planeConstant: 0,
                    }
                });
                resolve(this)
            })
        })

    }

    createScene() {
        this.scene = new Three.Scene();
    }

    createCamera() {
        this.camera = new Three.PerspectiveCamera(60, (this.el as HTMLElement).clientWidth / (this.el as HTMLElement).clientHeight, 0.1, 1000);
        this.camera.position.set(80, 80, 120);
        this.camera.lookAt(0, 0, 0);
    }

    createLight() {
        let spotLight = new Three.SpotLight('#ffffff');
        spotLight.position.set(0,100,100);
        spotLight.castShadow = true;
        spotLight.shadow.camera.near = 100;
        spotLight.distance = 0;
        spotLight.angle = 1;
        let spotLight2 = new Three.SpotLight('#ffffff');
        spotLight2.position.set(0,100,-100);
        spotLight2.castShadow = true;
        spotLight2.shadow.camera.near = 100;
        spotLight2.distance = 0;
        spotLight2.angle = 1;
        this.scene.add(spotLight)
        this.scene.add(spotLight2)
    }

    createRenderer() {
        this.renderer.setSize((this.el as HTMLElement).clientWidth, (this.el as HTMLElement).clientHeight);
        this.renderer.setClearColor('white', 1);
        this.renderer.localClippingEnabled = true;
        // helper
        if (this.options.helper) {
            var axisHelper = new Three.AxesHelper(200);
            this.scene.add(axisHelper);
            var gridHelper = new Three.GridHelper(200, 40, 0x2C2C2C, 0x888888);
            this.scene.add(gridHelper);
        }
        this.render()
    }

    renderTableTop(props: RectTypes, type = 'default') {
        this.props = props;
        this.shapeType = type;
        var topRender = roundedRect(new Three.Shape(), props, type);

        if (!topRender) console.warn('[Table Shape] warn shapeType, please check your shapeType or create new shape function')

        var geometry = new Three.ExtrudeGeometry(
            topRender,
            {
                depth: props.depth,
                bevelEnabled: props.bevel,
                bevelSize: 1,
                bevelSegments: 1,
                bevelThickness: 0,
            }
        );

        // uv
        geometry.computeBoundingBox();

        let max = geometry.boundingBox.max,
            min = geometry.boundingBox.min;
        let offset = new Three.Vector2(0 - min.x, 0 - min.y);
        let range = new Three.Vector2(max.x - min.x, max.y - min.y);
        let faces = geometry.faces;
        geometry.faceVertexUvs[0] = [];
        for (let i = 0; i < faces.length; i++) {
            let v1 = geometry.vertices[faces[i].a],
                v2 = geometry.vertices[faces[i].b],
                v3 = geometry.vertices[faces[i].c];
            geometry.faceVertexUvs[0].push([
                new Three.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
                new Three.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
                new Three.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
            ]);
        }
        geometry.uvsNeedUpdate = true;

        this.topRender = new Three.Mesh(geometry, this.topMaterial) as THREE.Mesh;

        this.tableTopPositionReset();
        this.megerQueue('topTable', this.topRender);

        this.megerModel();
    }

    renderOBJ(name: string,objUrl: string, objConfig: any, mtlUrl?: string) {
        if(!name) {
            console.warn("[Table render] please input obj name")
            return false
        }
        if(!objUrl) {
            console.warn("[Table render] please input .obj file url")
            return false
        }
        const that = this
        if(this.objTarget[name]) {
            const object = this.objTarget[name]
            assignObj(object, objConfig)
            this.render();
            return false;
        }
        let mtlPromise = new Promise((resolve: Function)=>{resolve(null)});
        if(mtlUrl) {
            let mtlLoader = new Three.MTLLoader();
            mtlPromise = new Promise((resolve: Function) => {
                mtlLoader.load(mtlUrl, (materials: any) => {
                    materials.preload();
                    resolve(materials)
                })
            })
        }
        mtlPromise.then(materials => {
            let objLoader = new Three.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(objUrl, (object: any)=>{
                object.name = name
                assignObj(object, objConfig);
                that.objTarget[name] = object;
                that.scene.add( object );
                that.render();
            })
        })
        
        function assignObj(object: any, objConfig: any) {
            object.scale.x = objConfig?.scale?.x ?? 1
            object.scale.y = objConfig?.scale?.y ?? 1
            object.scale.z = objConfig?.scale?.z ?? 1
            object.position.x = objConfig?.position?.x ?? 0
            object.position.y = objConfig?.position?.y ?? 0
            object.position.z = objConfig?.position?.z ?? 0
            object.rotateOnAxis(new Three.Vector3(1,0,0), objConfig?.rotate?.x ?? 0)
            object.rotateOnAxis(new Three.Vector3(0,1,0), objConfig?.rotate?.y ?? 0)
            object.rotateOnAxis(new Three.Vector3(0,0,1), objConfig?.rotate?.z ?? 0)
        }
    }


    megerQueue(key: string, target: THREE.Mesh) {
        this.renderQueue[key] = target;
    }

    megerModel(fn?: (resolve: Function, reject?: Function) => void) {
        this.scene.remove(this.modelGroup);
        this.modelGroup = new Three.Object3D();
        Object.keys(this.renderQueue).forEach(key => {
            this.modelGroup.add(this.renderQueue[key]);
        })
        new Promise(fn ? fn : (resolve: Function) => { resolve() }).then(() => {
            this.scene.add(this.modelGroup);
            this.render();
        })
    }

    tableTopPositionReset() {
        const t = this.topRender as THREE.Mesh
        t.rotation.y = 0;
        t.rotation.x = -1.6;
        t.rotation.z = 0;
        this.render();
    }

    setTopTable(props: RectTypes) {
        this.renderTableTop(props, this.shapeType);
    }

    setMaterial(options: DefaultSetting.MaterialOptions) {
        return new Promise(async (resolve: Function) => {
            await this.createTopMaterial(options);
            resolve();
            this.renderTableTop(this.props as RectTypes, this.shapeType);
        })
    }

    render() {
        if (!this.scene || !this.camera || !this.renderer) {
            console.warn('[Table render] you need mount element');
        }
        const that = this
        function fRender() {
            that.renderer.render(that.scene, that.camera);
        }
        fRender()
        if (!this.controls) {
            this.controls = new Three.OrbitControls(this.camera, this.renderer);
            this.controls.addEventListener('change', fRender);
        }
        (this.el as HTMLElement).appendChild(this.renderer.domElement);
    }

}


function roundedRect(shape: THREE.Shape, props: RectTypes, type: string) {

    const shapeTarget = {
        'hole': createHole,
        'default': createDefault,
        'bridge': createBridge,
    }

    return (shapeTarget as { [k: string]: Function })[type]?.(props)

    function createHole(props: RectTypes) {
        const { x, y, radius } = props
        shape.moveTo(x, y - radius);
        shape.bezierCurveTo(x - radius / 2, y - radius, x - radius, y - radius / 2, x - radius, y);
        shape.bezierCurveTo(x - radius, y + radius / 2, x - radius / 2, y + radius, x, y + radius);
        shape.bezierCurveTo(x + radius / 2, y + radius, x + radius, y + radius / 2, x + radius, y);
        shape.bezierCurveTo(x + radius, y - radius / 2, x + radius / 2, y - radius, x, y - radius);
        return shape
    }

    function createDefault(props: RectTypes) {
        const { x, y, width, height, radius } = props
        shape.moveTo(x, y + radius);
        shape.lineTo(x, y + height - radius);
        shape.quadraticCurveTo(x, y + height, x + radius, y + height);
        shape.lineTo(x + width - radius, y + height);
        shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        shape.lineTo(x + width, y + radius);
        shape.quadraticCurveTo(x + width, y, x + width - radius, y);
        shape.lineTo(x + radius, y);
        shape.quadraticCurveTo(x, y, x, y + radius);
        return shape
    }

    function createBridge(props: RectTypes) {
        const { x, y, width, height, radius } = props
        shape.moveTo(x, y + radius);
        shape.lineTo(x, y + height - radius);
        shape.quadraticCurveTo(x, y + height, x + radius, y + height);
        shape.lineTo(x + width - radius, y + height);
        shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        shape.lineTo(x + width, y + radius);
        shape.quadraticCurveTo(x + width, y, x + width - radius, y);
        shape.quadraticCurveTo(x + width / 2, y / 3, x + radius, y);
        shape.quadraticCurveTo(x, y, x, y + radius);
        return shape
    }

}

export default LsThree

