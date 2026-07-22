import type { Types } from "mongoose";

function isObjectId(value: unknown): value is Types.ObjectId {
  return Boolean(
    value &&
      typeof value === "object" &&
      "toString" in value &&
      // mongoose ObjectId
      (value.constructor?.name === "ObjectId" ||
        (value as { _bsontype?: string })._bsontype === "ObjectId"),
  );
}

export function toId(value: Types.ObjectId | string | undefined | null) {
  if (!value) return "";
  return typeof value === "string" ? value : value.toString();
}

function serializeValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (isObjectId(value)) return value.toString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === "__v") continue;
      if (k === "_id") {
        out.id = toId(v as Types.ObjectId);
        continue;
      }
      out[k] = serializeValue(v);
    }
    return out;
  }
  return value;
}

export function serializeDoc<T extends Record<string, unknown>>(doc: T) {
  return serializeValue(doc) as Record<string, unknown>;
}

export function stripSupplierSource<T extends Record<string, unknown>>(doc: T) {
  const copy = { ...doc };
  delete copy.supplierSource;
  return copy;
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
