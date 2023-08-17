import * as b from "babylonjs"
import "babylonjs-loaders"

function uuid(prefix:string = ""){
  let u = prefix;
  if(u.length){
    u += "_"
  }
  for(let i = 0; i<5; i++){
    u += Math.round(Math.random() * 16).toString(16);
  }
  return u;
}

export enum Models {
  Banner = "banner",
  Barrel = "barrel",
  CharacterHuman ="character-human",
  CharacterOrc = "character-orc",
  Chest = "chest",
  Coin = "coin",
  Column = "column",
  Dirt = "dirt",
  Door = "door",
  FloorDetail = "floor-detail",
  Floor = "floor",
  Rocks = "rocks",
  Stairs = "stairs",
  Stones = "stones",
  Trap = "trap",
  WallHalf = "wall-half",
  WallNarrow = "wall-narrow",
  WallOpening = "wall-opening",
  Wall = "wall",
  WoodStructure = "wood-structure",
  WoodSupport = "wood-support",
}

export class Assets {
  private scene: b.Scene | undefined;

  private models: Map<Models, b.TransformNode> = new Map;

  constructor(scene?: b.Scene){
    this.scene = scene;
  }


  async load(){
    for(const key in Models){
      const value = (Models as any)[key]
      await this.loadModel(value)
    }
  }

  private async loadModel(name:Models){
    console.log("loadModel", name)
    const res = await b.SceneLoader.ImportMeshAsync("", "models/tiles/", `${name}.glb`);

    res.meshes.forEach((m, i, a) => {
      m.isVisible = false
      m.receiveShadows = true
    })
    const n = new b.TransformNode(name + "-template")
    n.setEnabled(false)
    res.meshes.slice(1).forEach(m => (m as b.Mesh).createInstance(m.name).setParent(n));

    this.models.set(name, n)
  }

  createModelInstance(model:Models, name?:string): b.TransformNode{
    name = name ?? uuid(model)
    return this.models.get(model)?.clone(name, null) ?? new b.TransformNode(name);
  }

}


