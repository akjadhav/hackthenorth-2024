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

    // otherwise, it's an object id
    const allEntities = await ctx.db.query("entities").collect();
    
    console.log(allEntities);

    const results = allEntities.flatMap(entity => 
        entity.objects.filter(obj => obj.id === id)
          .map(obj => ({
            spaceId: entity.spaceId,
            objectId: obj.id,
            objectLocation: obj.location
          }))
      );

    if (results.length === 0) {
      throw new Error(`No object found with id: ${id}`);
    }

    return results[0];
  },
});