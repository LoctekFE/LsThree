interface CommonTypes {
    x: number,
    y: number,
    radius: number
}

export type RectTypes = { width: number, height: number } & CommonTypes

export interface ILsThree {
    renderQueue: { [k: string]: any } | undefined;
    el?: HTMLElement | null;
    topMaterial?: unknown;
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    props?: any;
    shapeType?: string
    topRender?: any;
    modelGroup?: any;
    controls?: any;
}

export namespace DefaultSetting {
    export interface Options {
        helper: boolean
    }
}