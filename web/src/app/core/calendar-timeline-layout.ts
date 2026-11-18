import type {TimedBlockInput,PositionedTimedBlock} from './ios-event-palette';
/** Port of native EventDetailTimelineLayout: equal-start siblings, contained events and expandable lanes. */
export type NativeTimedBlock<T> = PositionedTimedBlock<T> & {depth:number;contentEndMinutes:number};
export function nativeTimelineLayout<T>(items:readonly TimedBlockInput<T>[],options:{minimumDuration?:number;minimumHeaderDuration?:number;start?:number;end?:number;nestedInset?:number}={}):NativeTimedBlock<T>[] {
 type Node={item:TimedBlockInput<T>;depth:number;order:number;children:Node[]};
 const collisionEnd=(item:TimedBlockInput<T>)=>Math.max(item.endMinutes,item.startMinutes+(options.minimumDuration??27));
 const compare=(a:TimedBlockInput<T>,b:TimedBlockInput<T>)=>a.startMinutes-b.startMinutes||b.endMinutes-a.endMinutes||a.id.localeCompare(b.id);
 const sorted=[...items].sort(compare),groups:TimedBlockInput<T>[][]=[];let group:TimedBlockInput<T>[]=[],end=-Infinity;
 for(const item of sorted){if(group.length&&item.startMinutes>=end){groups.push(group);group=[];end=-Infinity;}group.push(item);end=Math.max(end,collisionEnd(item));}if(group.length)groups.push(group);
 function placeNodes(nodes:Node[],left:number,width:number):NativeTimedBlock<T>[]{
  const visible=nodes.filter(n=>n.item.startMinutes<(options.end??Infinity)&&n.item.endMinutes>(options.start??-Infinity)).sort((a,b)=>compare(a.item,b.item));
  const ends:number[]=[],placements:Array<{node:Node;column:number}>=[];
  for(const node of visible){let column=ends.findIndex(end=>end<=node.item.startMinutes);if(column<0)column=ends.length;ends[column]=collisionEnd(node.item);placements.push({node,column});}
  const count=Math.max(1,ends.length),lane=width/count;
  return placements.flatMap(({node,column})=>{const blockers=placements.filter(p=>p.column>column&&p.node.item.startMinutes<collisionEnd(node.item)&&collisionEnd(p.node.item)>node.item.startMinutes);const endColumn=blockers.length?Math.min(...blockers.map(p=>p.column)):count;const spacing=count>1?Math.min(.8,lane/2):0;const x=left+column*lane+spacing/2,w=Math.max(.1,(endColumn-column)*lane-spacing),inset=Math.min(options.nestedInset??2,w/3);
   return [{...node.item,colIndex:column,colCount:count,leftPct:x,widthPct:w,depth:node.depth,contentEndMinutes:node.children.length?Math.min(...node.children.map(n=>n.item.startMinutes)):node.item.endMinutes},...placeNodes(node.children,x+inset,w-inset)];});
 }
 return groups.flatMap(items=>{const roots:Node[]=[],nodes:Node[]=[];for(let i=0;i<items.length;){const start=items[i].startMinutes;let next=i+1;while(next<items.length&&items[next].startMinutes===start)next++;
  const starting=items.slice(i,next),backdrops=starting.filter(e=>e.endMinutes-e.startMinutes>=1439.98),batch=starting.filter(e=>e.endMinutes-e.startMinutes<1439.98);
  for(const item of backdrops){const node={item,depth:0,order:nodes.length,children:[]};roots.push(node);nodes.push(node);}
  const end=Math.max(start,...batch.map(collisionEnd));const candidates=nodes.filter(n=>n.item.startMinutes<start&&n.item.endMinutes>end&&n.depth<4&&start-Math.max(options.start??n.item.startMinutes,n.item.startMinutes)>=(options.minimumHeaderDuration??0));
  const busy=(n:Node)=>n.children.some(c=>c.item.startMinutes<end&&collisionEnd(c.item)>start);candidates.sort((a,b)=>Number(busy(a))-Number(busy(b))||a.depth-b.depth||a.order-b.order);const parent=candidates[0];
  for(const item of batch){const node={item,depth:(parent?.depth??-1)+1,order:nodes.length,children:[]};if(parent)parent.children.push(node);else roots.push(node);nodes.push(node);}i=next;
 }return placeNodes(roots,0,100);});
}
