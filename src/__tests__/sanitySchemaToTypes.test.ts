import { sanitySchemaToTypes } from "../sanitySchemaToTypes";
import { SchemaType, ObjectFieldType, ObjectField } from "@sanity/types";

describe("sanitySchemaToTypes", () => {
  it("generates TypeScript interfaces from Sanity.io schemas", () => {
    const schema: SchemaType[] = [
      {
        name: "post",
        type: "document",
        jsonType: "object",
        fields: [
          {
            name: "title",
            title: "Title",
            type: {
              name: "string",
              jsonType: "string",
            } as unknown as ObjectFieldType<SchemaType>,
          },
          {
            name: "content",
            title: "Content",
            type: {
              name: "string",
              jsonType: "string",
            } as unknown as ObjectFieldType<SchemaType>,
          },
        ] as unknown as ObjectField[],
      },
    ] as unknown as SchemaType[];

    const result = sanitySchemaToTypes(schema);
    const expected = `interface post {
  title: string;
  content: string;
}\n`;

    expect(result).toBe(expected);
  });
});
