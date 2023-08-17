import * as b from "babylonjs"
import 'babylonjs-loaders'
import { Assets, Models } from "./assets";
import { MapGenerator } from "./map";

const VERSION = "v 0.0.8-a"
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
  // This creates a basic Scene object (non-mesh)
  const scene = new b.Scene(engine);
  const assets = new Assets(scene)
  //scene.debugLayer.show();
  scene.clearColor = new b.Color4(252 / 256, 219 / 256, 190 / 256, 1);
  await assets.load();

  const camera = new b.ArcRotateCamera("camera", b.Tools.ToRadians(90), b.Tools.ToRadians(65), 10, b.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light2 = new b.HemisphericLight("light", new b.Vector3(0, 1, 0), scene);
  light2.intensity = 0.3;
  const light = new b.DirectionalLight("light1", new b.Vector3(-1, -1, 1), scene);

  light.position = new b.Vector3(3, 9, 3);


  const generator = new b.ShadowGenerator(1024, light);
  generator.filteringQuality = b.ShadowGenerator.QUALITY_HIGH
  generator.usePercentageCloserFiltering = true


  // Our built-in 'ground' shape.
  const ground = b.MeshBuilder.CreateGround("ground", { width: 40, height: 40 }, scene);
  ground.position.y = -0.001
  ground.receiveShadows = true;

  let groundMaterial = new b.BackgroundMaterial("Ground Material", scene);
  ground.material = groundMaterial;

  const groundTexture = new b.Texture("https://assets.babylonjs.com/environments/backgroundGround.png", scene);
  groundMaterial.diffuseTexture = groundTexture;
  groundMaterial.diffuseTexture.hasAlpha = true;


  groundMaterial.useRGBColor = false;
  // 	207	193	181
  // 126	109	95
  //groundMaterial.primaryColor = new b.Color3(126/256,	109/256,	95/256)
  groundMaterial.primaryColor = new b.Color3(scene.clearColor.r * 0.5, scene.clearColor.g * 0.5, scene.clearColor.b * 0.5)
  // groundMaterial.primaryLevel = 1;
  // groundMaterial.secondaryLevel = 0;
  // groundMaterial.tertiaryLevel = 0;

  const s = 10;
  const map = new MapGenerator()
    .size(s, s)
    .generate();

  function random<T>(a:T[]):T {
    return a[Math.floor(Math.random() * a.length)]
  }

  function create(model:Models, c:number, r:number){
    const m = assets.createModelInstance(model)
    m.getChildMeshes().forEach(m => { generator.addShadowCaster(m) })
    m.position = new b.Vector3(c - s / 2, 0, r - s / 2);

  }

  map.forEach((node, c, r) => {
    const t = node.type
    const floors = [Models.Floor, Models.FloorDetail]
    const items = [Models.Banner, Models.Barrel, Models.Chest, Models.Coin, Models.Door, Models.Rocks, Models.Stones, Models.Trap, Models.WoodStructure, Models.WoodSupport]
    const walls = [Models.Wall, Models.WallHalf, Models.WallNarrow, Models.WallOpening]
    let model = Models.Floor;
    if(Math.random() < 0.75){
      create(random(floors), c, r)
      if(Math.random() < 0.4)
        create(random(items), c, r)
    }else{
      create(random(walls), c, r)
    }
  });


  // const m = assets.createModelInstance(Models.Floor)
  // const m1 = assets.createModelInstance(Models.FloorDetail)
  // const m2 = assets.createModelInstance(Models.Banner)
  // const m3 = assets.createModelInstance(Models.Wall)
  // m1.position.x = 1
  // m2.position.x = -1
  // m2.position.z = -1
  // m3.position.x = -1

  // m.getChildMeshes().forEach(m => {generator.addShadowCaster(m)})
  // m1.getChildMeshes().forEach(m => {generator.addShadowCaster(m)})
  // m2.getChildMeshes().forEach(m => {generator.addShadowCaster(m)})
  // m3.getChildMeshes().forEach(m => {generator.addShadowCaster(m)})
  // const barrel = await b.SceneLoader.ImportMeshAsync("", "models/tiles/", "column.glb");
  // console.log("barrel", barrel)
  // barrel.meshes.forEach((m, i, a) => m.isVisible = false)

  // const mesh = barrel.meshes[2] as b.Mesh

  // const n = new b.TransformNode("n0")
  // n.setEnabled(false)
  // barrel.meshes.slice(1).forEach(m => (m as b.Mesh).createInstance(m.name).setParent(n));

  // for(let i = 0; i < 25; i++){
  //   const ni = n.clone("n" + i, null) as b.TransformNode;
  //   ni.position.x = i % 5 - 2
  //   ni.position.z = Math.floor(i / 5) - 2
  //   const s = Math.random() * 0.2 + 0.1
  //   ni.scaling = new b.Vector3(s,s,s)
  // }

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
