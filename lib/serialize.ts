// lib/serialize.ts
export function serialize<T>(data: T): unknown {
  return JSON.parse(
    JSON.stringify(data, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}