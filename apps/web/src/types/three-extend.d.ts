declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  export class GLTFLoader {
    load(
      url: string,
      onLoad: (gltf: any) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: unknown) => void
    ): void;
  }
}
