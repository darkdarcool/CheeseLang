import { readFileSync } from "fs";
import { Lexer } from "./lexer"
import { Parser } from "./parser";
import { Runtime } from "./runtime"
import { Console } from "./console"
import { question } from "readline-sync"

export function getFileContent(path: string): string {
  return readFileSync(path, { encoding: "utf-8" });
}
if (process.argv[2] === undefined){ // my way works, look at  iterminal
  var c = new Console(new Runtime([]));
  while (true) {
    let code = question("> ");
    c.runline(code);
  }
} else {
  const lexer = new Lexer(getFileContent(process.argv[2]));
  const tokens = lexer.lex();
  
  const parser = new Parser(tokens);
  const grouped = parser.parse();
  
  const runtime = new Runtime(grouped)
  runtime.run(false);
}