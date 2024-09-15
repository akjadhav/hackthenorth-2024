import { query } from "./_generated/server";
import { v } from "convex/values";

export const getEntityInfo = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const { id } = args;

    // if the id starts with "s_", it's a space id
    if (id.startsWith("s_")) {
      return { spaceId: id };
    }

    // otherwise, it's an object id and need to fetch all entities
    const allEntities = await ctx.db.query("entities").collect();
    // filter in memory
    const entity = allEntities.find(entity => 
      entity.objects.some(obj => obj.id === id)
    );

    if (!entity) {
      throw new Error(`No entity found for object id: ${id}`);
    }

    const object = entity.objects.find(obj => obj.id === id);
    if (!object) {
      throw new Error(`Object with id ${id} not found in the entity`);
    }

    return {
      spaceId: entity.spaceId,
      objectId: id,
      objectLocation: object.location
    };
  },
});