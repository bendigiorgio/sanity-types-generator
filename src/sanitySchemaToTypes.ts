import { ObjectField, SchemaType, ObjectFieldType } from "@sanity/types";

function generateType(type: ObjectFieldType<SchemaType>): string {
  switch (type.name) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "date":
      return "string";
    case "datetime":
      return "string";
    default:
      return "unknown";
  }
}

function generateInterface(name: string, fields: ObjectField[]): string {
  let result = `interface ${name} {\n`;

  fields.forEach((field) => {
    const fieldType = generateType(field.type);
    result += `  ${field.name}: ${fieldType};\n`;
  });

  result += "}\n";
  return result;
}

export function sanitySchemaToTypes(schema: SchemaType[]): string {
  let output = "";

  schema.forEach((type) => {
    console.log("Type:", type);
    if (type.jsonType === "object" && "fields" in type) {
      output += generateInterface(type.name, type.fields);
    }
  });
  console.log("Output:", output);

  return output;
}
