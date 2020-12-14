import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three-obj-mtl-loader'

Three.OrbitControls = (camera: THREE.Camera, Renderer: THREE.Renderer) => {
    return new OrbitControls(camera, Renderer.domElement)
}

Three.OBJLoader = OBJLoader

export default Three