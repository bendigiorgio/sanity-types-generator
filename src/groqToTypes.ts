import { SanityClient } from "@sanity/client";

async function fetchQueryType(
  client: SanityClient,
  query: string
): Promise<any> {
  try {
    const data = await client.fetch(query);
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    throw new Error(
      `Error fetching GROQ query type: ${
        error instanceof Error && error.message
      }`
    );
  }
}

export function generateTypeFromValue(value: any): string {
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return `Array<${generateTypeFromValue(value[0])}>`;
  if (value === null) return "unknown";
  if (typeof value === "object") {
    let result = "{\n";
    Object.entries(value).forEach(([key, val]) => {
      result += `  ${key}: ${generateTypeFromValue(val)};\n`;
    });
    result += "}";
    return result;
  }
  return "unknown";
}

export async function groqToTypes(
  client: SanityClient,
  query: string
): Promise<string> {
  const data = await fetchQueryType(client, query);
  return generateTypeFromValue(data);
}
