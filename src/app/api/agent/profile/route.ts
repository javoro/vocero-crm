import { z } from "zod";
import { parseBody, withAuth } from "@/lib/api";
import { getDb, schema } from "@/lib/db";
import { newId } from "@/lib/db/ids";
import { scoped } from "@/lib/db/tenant";
import { isAiConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export const GET = withAuth(async (session) => {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.agentProfile)
    .where(scoped(schema.agentProfile.organizationId, session.organizationId))
    .limit(1);
  const p = rows[0];
  if (!p) {
    return Response.json({
      profile: {
        enabled: false,
        name: "Asistente",
        tone: null,
        instructions: null,
        escalationRules: null,
        greeting: null,
      },
      aiConfigured: isAiConfigured(),
    });
  }
  return Response.json({
    profile: {
      enabled: p.enabled,
      name: p.name,
      tone: p.tone,
      instructions: p.instructions,
      escalationRules: p.escalationRules,
      greeting: p.greeting,
    },
    aiConfigured: isAiConfigured(),
  });
});

const putSchema = z.object({
  enabled: z.boolean().optional(),
  name: z
    .string()
    .max(100)
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : "Asistente")),
  tone: z
    .string()
    .max(1000)
    .nullable()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
  instructions: z
    .string()
    .max(12000)
    .nullable()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
  escalationRules: z
    .string()
    .max(6000)
    .nullable()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
  greeting: z
    .string()
    .max(2000)
    .nullable()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
});

export const PUT = withAuth(async (session, req: Request) => {
  const body = await parseBody(req, putSchema);
  if (!body.ok) return body.response;

  const db = getDb();
  const existing = await db
    .select({ id: schema.agentProfile.id })
    .from(schema.agentProfile)
    .where(scoped(schema.agentProfile.organizationId, session.organizationId))
    .limit(1);

  if (existing[0]) {
    await db
      .update(schema.agentProfile)
      .set({ ...body.data, updatedAt: new Date() })
      .where(scoped(schema.agentProfile.organizationId, session.organizationId));
  } else {
    await db.insert(schema.agentProfile).values({
      id: newId("agentProfile"),
      organizationId: session.organizationId,
      name: body.data.name ?? "Asistente",
      tone: body.data.tone ?? null,
      instructions: body.data.instructions ?? null,
      escalationRules: body.data.escalationRules ?? null,
      greeting: body.data.greeting ?? null,
      enabled: body.data.enabled ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return Response.json({ ok: true });
});
