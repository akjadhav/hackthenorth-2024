import { httpAction, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
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


export const update = mutation({
  args: { spaceId: v.string(), description: v.string(), objects: v.any() },
  handler: async (ctx, args) => {
    const { db } = ctx;
    const { spaceId, description, objects } = args;

    const document = await db.query("entities")
      .filter(q => q.eq(q.field("spaceId"), spaceId))
      .first();

    if (document) {
      await db.patch(document._id, { objects, description });
    }
  },
});

export const updateEntities = httpAction(async (ctx, request) => {
  const { spaceId, description, objects } = await request.json();

  await ctx.runMutation(api.entities.update, { spaceId, description, objects });

  return new Response(null, {
    status: 200,
  });
});

export const getAll = query({ handler: async (ctx) => ctx.db.query("entities").collect() });
