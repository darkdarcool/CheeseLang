import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Runtime } from "./runtime";

export class Console {
    runtime: Runtime;
    constructor(runtime: Runtime){
        this.runtime = runtime
    }
    runline(code: string){
        const lexer = new Lexer(code);

        const parser = new Parser(lexer.lex());
        this.runtime.tokens = parser.parse();
        this.runtime.run(true)
    }
    start(){

    }
}