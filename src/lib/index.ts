import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

Three.OrbitControls = (camera: THREE.Camera, Renderer: THREE.Renderer) => {
    return new OrbitControls(camera, Renderer.domElement)
}


export default Three