import { Nodes } from "./Nodes"

export class Lexer {
  content: string;
  tokens: Array<Nodes>
  constructor(content: string) {
    this.content = content;
  }
  tok(tok: string){
    if (tok.startsWith('$')){
        return {
            type: "VAR",
            value: tok.slice(1)
        }
    } else if (tok.startsWith("'") && tok.endsWith("'")){
        return {
            type: "CHAR", 
            value: tok.slice(1, -1)
        }
    } else if (!isNaN(Number(tok))){
        return { 
            type: "INT",
            value: Number(tok)
        }
    } else {
        return {
            type: "KEYWORD",
            value: tok
        }
    }
  }
  lex() {
    let content = this.content;
    content = content.replace(/\r/g, "")
    let toks = content.split(" ");
    let lexed = [];
    for(var i = 0; i < toks.length; i++){
        let tok = toks[i]
        if (tok.includes('\n')){
            // this shitty code is because newlines and carriage returns
            var t = tok.split(RegExp('\n'))
            for(let i = 0; i < t.length; i++){
                if (typeof t[i] === 'string') {
                    lexed[lexed.length] = this.tok(t[i])
                    if (!(i===t.length-1)){
                        lexed[lexed.length] = {
                            type: 'NEWLINE',
                            value: '\n',
                        }
                    }
                }
            }
        } else {
            lexed[lexed.length] = this.tok(tok)
        }
    }
    return lexed
  }
}
/*
mal 1 $out
set $out 0 'h'
set $out 1 'i'
disp $out # prints hi
*/
