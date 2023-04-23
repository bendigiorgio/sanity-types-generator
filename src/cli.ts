#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateTypes } from "./index.js";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

function createConfigFile(configPath: string) {
  const defaultConfig = {
    schemaPath: "src/sanity/schemas/**/*.{ts,js}",
    groqQueryPattern: "**/*.{groq.js,groq.ts}",
    outputPath: "typings",
    sanity: {
      projectId: "your-project-id",
      dataset: "your-dataset",
      apiVersion: "2023-04-04",
      useCdn: "false",
    },
  };

  fs.writeFileSync(configPath, yaml.dump(defaultConfig), "utf8");
  console.log(`Configuration file created at ${configPath}`);
}

yargs(hideBin(process.argv))
  .command(
    "init [config]",
    "Create a default configuration file",
    (args) => {
      args.positional("config", {
        describe: "Path to the configuration file",
        default: "codegen.yml",
      });
    },
    (argv) => {
      const configPath = path.resolve(process.cwd(), argv.config as string);
      if (fs.existsSync(configPath)) {
        console.error(`Configuration file already exists at ${configPath}`);
        process.exit(1);
      } else {
        createConfigFile(configPath);
      }
    }
  )
  .command(
    "generate [config]",
    "Generate TypeScript typings for Sanity.io schemas and GROQ queries",
    (args) => {
      args.positional("config", {
        describe: "Path to the configuration file",
        default: "codegen.yml",
      });
    },
    async (argv) => {
      try {
        await generateTypes(argv.config as string);
        console.log("Successfully generated typings");
      } catch (error) {
        console.error(
          `Error generating typings: ${error instanceof Error && error.message}`
        );
        process.exit(1);
      }
    }
  )
  .demandCommand(1, "")
  .help()
  .strict().argv;
