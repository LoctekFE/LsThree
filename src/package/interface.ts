interface CommonTypes {
    x: number;
    y: number;
    depth: number;
    width: number;
    height: number;
    bevel?: boolean;
}

export type RectTypes = { radius: number } & CommonTypes

export interface ILsThree {
    renderQueue: { [k: string]: THREE.Mesh };
    el?: HTMLElement | null;
    topMaterial?: unknown;
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    props?: RectTypes;
    shapeType?: string
    topRender?: THREE.Mesh;
    modelGroup: THREE.Object3D;
    controls: any;
}

export namespace DefaultSetting {
    export interface InitOptions {
        helper: boolean
    }

    export interface MaterialOptions {
        url: string;
        hole?: {
            x: number;
            y: number;
            r: number;
        }
    }
}