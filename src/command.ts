import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { type Argv } from "./types.ts";

const ivar = yargs(hideBin(process.argv)).argv as Argv;
let ccreator = yargs(hideBin(process.argv));

export { ivar, ccreator };
