
class MapNode {
  constructor(public type:number){
  }
}

export class Map {
  static INVALID_NODE = new MapNode(-1);

  private tiles:MapNode[] = [];
  private columns = 0;
  private rows = 0;

  constructor(tiles: MapNode[], columns:number, rows: number){
    this.tiles = tiles;
    this.columns = columns
    this.rows = rows
  }

  get(c:number, r:number){
    const idx = this.index(c, r);
    return this.tiles[idx] || Map.INVALID_NODE;
  }

  forEach(callback: (n:MapNode, c:number, r:number)=>void){
    this.tiles.forEach((n, i)=>{
      const {c, r} = this.coord(i)
      callback(n, c, r)
    })
  }

  private index(c:number, r:number){
    return c + r * this.columns;
  }

  private coord(index:number){
    const c = index % this.columns
    const r = Math.floor(index / this.columns)
    return {c, r}
  }
}

export class MapGenerator {
  columns:number = 1;
  rows:number = 1;

  size(c:number, r:number){
    this.columns = c;
    this.rows = r;
    return this
  }

  generate(): Map {
    const tiles:MapNode[] = [];
    const size = this.columns * this.rows;

    for(let i=0; i<size; i++){
      tiles.push(new MapNode(Math.floor(Math.random() * 2)))
    }

    return new Map(tiles, this.columns, this.rows);
  }
}
