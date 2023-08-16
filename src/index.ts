import * as b from "babylonjs"
import 'babylonjs-loaders'

const VERSION = "v 0.0.7-a"
console.log(VERSION)


const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

let engine: b.Engine;
let scene: b.Scene;
let sceneToRender: b.Scene;

const startRenderLoop = function (engine: b.Engine, canvas: HTMLCanvasElement) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
}

const createDefaultEngine = function () {
  return new b.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
};

const createScene = async function () {
  // This creates a basic b Scene object (non-mesh)
  const scene = new b.Scene(engine);

  const camera = new b.ArcRotateCamera("camera", b.Tools.ToRadians(90), b.Tools.ToRadians(65), 10, b.Vector3.Zero(), scene);

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new b.HemisphericLight("light", new b.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'ground' shape.
  const ground = b.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
  let groundMaterial = new b.StandardMaterial("Ground Material", scene);
  ground.material = groundMaterial;

  const groundTexture = new b.Texture("textures/tiles/tile_0040.png", scene);
  groundMaterial.diffuseTexture = groundTexture;

  const barrel = await b.SceneLoader.ImportMeshAsync("barrel", "models/tiles/", "barrel.glb");
  console.log("barrel", barrel)
  barrel.meshes.forEach((m, i, a) => m.isVisible = false)

  const mesh = barrel.meshes[2] as b.Mesh

  const n = new b.TransformNode("n0")
  barrel.meshes.slice(1).forEach(m => (m as b.Mesh).createInstance(m.name).setParent(n));

  for(let i = 0; i < 25; i++){
    const ni = n.clone("n" + i, null) as b.TransformNode;
    ni.position.x = i % 5 - 2
    ni.position.z = Math.floor(i / 5) - 2
    const s = Math.random() * 0.2 + 0.1
    ni.scaling = new b.Vector3(s,s,s)
  }

  return scene;
};

const initFunction = async function () {
  const asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      return createDefaultEngine();
    }
  }

  engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  startRenderLoop(engine, canvas);
  engine.displayLoadingUI();
  scene = await createScene();
  engine.hideLoadingUI();
};

initFunction().then(() => {
  sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
