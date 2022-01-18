export class Parser {
  tokens: Array<object>
  constructor(tokens: Array<object>) {
    this.tokens = tokens;
  } 
  parse(): Array<any> {
    let toks: Array<any> = [];
    var curr: Array<any> = []; // for current grouping
    for(var i = 0; i < this.tokens.length; i++) {
      let tok: any = this.tokens[i];
      if (tok.type == "NEWLINE") {
        toks.push(curr);
        curr = [];
      } else {
        curr.push(tok); 
      }
    }
    if (!(curr.length === 0)) {
      toks.push(curr)
    }
    return toks;
  }
} // NEWLINE will always have value \n so either works