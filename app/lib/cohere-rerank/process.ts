export interface Metadata {
  [key: string]: any;
}

export class Document {
  constructor(
    public id: string,
    public content: string,
    public metadata: Metadata
  ) {}
}

export class SpaceDocument extends Document {
  constructor(
    space_id: string,
    space_name: string,
    floor: number,
    floor_id: string
  ) {
    super(
      space_id,
      `Space: ${space_name}, Floor: ${floor}`,
      {
        space_name,
        floor,
        floor_id
      }
    );
  }
}

export class ObjectDocument extends Document {
  constructor(
    object_id: string,
    space_name: string,
    object_class: string,
    description: string
  ) {
    super(
      object_id,
      `Object in ${space_name}: ${description}`,
      {
        space_name,
        object_class
      }
    );
  }
}

interface JsonItem {
  spaceId: string;
  space: string;
  floor: number;
  floorId: string;
  objects: {
    id: string;
    class: string;
    description: string;
  }[];
}

export function processJson(jsonData: JsonItem[]): Document[] {
  const documents: Document[] = [];

  for (const item of jsonData) {
    const spaceDoc = new SpaceDocument(
      item.spaceId,
      item.space,
      item.floor,
      item.floorId
    );
    documents.push(spaceDoc);

    for (const obj of item.objects) {
      const objDoc = new ObjectDocument(
        obj.id,
        item.space,
        obj.class,
        obj.description
      );
      documents.push(objDoc);
    }
  }

  return documents;
}