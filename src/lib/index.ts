import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import 'three/examples/js/loaders/OBJLoader'
import 'three/examples/js/loaders/MTLLoader'

Three.OrbitControls = (camera: THREE.Camera, Renderer: THREE.Renderer) => {
    return new OrbitControls(camera, Renderer.domElement)
}

export default Three