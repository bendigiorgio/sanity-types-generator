import "ts-node/register";
import fs from "fs-extra";
import path from "path";
import glob from "glob";
import yaml from "js-yaml";
import { sanitySchemaToTypes } from "./sanitySchemaToTypes.js";
import { groqToTypes } from "./groqToTypes.js";
import { createClient } from "@sanity/client";
import { esbuildImport } from "./esbuildImport.js";

interface Config {
  schemaPath: string;
  groqQueryPattern: string;
  outputPath: string;
  sanity: {
    projectId: string;
    dataset: string;
    apiVersion: string;
  };
}

async function generateTypes(configPath: string) {
  // Load configuration
  const config: Config = yaml.load(
    fs.readFileSync(configPath, "utf8")
  ) as Config;

  // Create a Sanity client
  const client = createClient(config.sanity);

  // Read Sanity.io schema files
  const schemaFiles = glob.sync(config.schemaPath);
  const schemaPromises = schemaFiles.map(async (file) => {
    const fullPath = path.join(process.cwd(), file);
    return await esbuildImport(fullPath);
  });

  const schema = await Promise.all(schemaPromises);
  console.log("Schema:", schema);
  // Generate typings for Sanity.io schemas
  const schemaTypes = sanitySchemaToTypes(schema);

  // Generate typings for GROQ queries
  const groqFiles = glob.sync(config.groqQueryPattern, { absolute: true });
  // const groqTypes = await Promise.all(
  //   groqFiles.map(async (file) => {
  //     const { default: query } = await import(file);
  //     const fileName = path.basename(file, path.extname(file));
  //     const types = await groqToTypes(client, query);
  //     return `type ${fileName} = ${types};`;
  //   })
  // );

  // Write typings to the output folder
  fs.ensureDirSync(config.outputPath);
  fs.writeFileSync(
    path.join(config.outputPath, "schema.ts"),
    schemaTypes,
    "utf8"
  );
  // fs.writeFileSync(
  //   path.join(config.outputPath, "groq.d.ts"),
  //   groqTypes.join("\n"),
  //   "utf8"
  // );
}

export { generateTypes };
