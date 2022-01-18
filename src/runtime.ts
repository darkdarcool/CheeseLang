import { CommandInteractionOptionResolver } from "discord.js";
import { LangError } from "./error"

// why is this here
type tok = {
  type: string,
  value: string | number
}
function e(exit: boolean){
  return function error(i: number, text: string){
    (new LangError(i, text)).out(exit)
    
  }
}

const removeItem = (obj: any, key: any) => {
  if (!obj.hasOwnProperty(key))
     return
  if (isNaN(parseInt(key)) || !(obj instanceof Array))
     delete obj[key]
  else
    obj.splice(key, 1)
  return obj
};
export class Runtime {
  tokens: Array<any>;
  vars: any;
  constructor(tokens: Array<any>)  {
    this.tokens = tokens;
    this.vars = {};
  }
  run(isRepl: boolean) {
    const error = e(isRepl);
    for (let i = 0; i < this.tokens.length; i++) {
      let line = this.tokens[i];
      if (line[0].type != "KEYWORD") {
        error(i, "Only keywords can start a statment"); // make this better later
        break
      }
      if (line[0].value == "mal") {
        if (!line[1]) { 
          error(i, "Unexpected statment end")
          break // to stop the code
        }
        if (line[1].type != "INT") {
          error(i, "Unknown memory size")
          break
        }
        let memSize = line[1].value;
        if (!line[2]) { 
          error(i, "Unexpected statment end");
          break
        }
        if (line[2].type != "VAR") { 
          error(i, "Unknown variable specifier wtf is this err message");
          break
        }
        let memName = line[2].value;
        this.vars[memName] = {
          size: memSize,
          value: []
        }
      }
      else if (line[0].value == "set") {
        // just use error for smooth intergration 
        if (!line[1]) { 
          error(i, "Unexpected statment end");
          break
        }
        // if you could get nice error message going that would be great
        if (line[1].type != "VAR") { 
          error(i, "Unknown var specifier");
          break
        }
        let varName = line[1].value;
        if (!(varName in this.vars)) {
          error(i, "Memory fault");
          break
        }
        if (!line[2]) { 
          error(i, "Cannot find memory location specifier");
          break
        }
        if (line[2].type != "INT") { 
          error(i, "Illegal memory location specifier");
          break
        }
        let loc = line[2].value;
        if (!line[3]) { 
          error(i, "NULL memory placement isn't allowed");
          break
        }
        let value = line[3].value;
        if (this.vars[varName].size < loc) { 
          error(i, "Exceeded variable memory limit");
          break
        }
        this.vars[varName].value[loc] = value;
      }
      else if (line[0].value == "disp") {
        if (!line[1]) { 
          error(i, "Variable not found");
          break
        }
        if (line[1].type != "VAR") { 
          error(i, "You can only print variables to standard out");
          break
        }
        let varName = line[1].value;
        if (!(varName in this.vars)) {
          error(i, "Memory fault");
          break
        }
        let value: Array<any> = this.vars[varName].value;
        for (let i = 0; i < value.length; i++) {
          process.stdout.write(value[i]);
        }
        process.stdout.write("\n")
      }
      else if (line[0].value === 'wipe') {
        if (line[1] === undefined) {
          this.vars = {}
        }
        else {
          if (line[1].type != "VAR") { 
            error(i, "Can't remove literal "+line[1].type);
            break
          }
          let varName = line[1].value;
          if (!(varName in this.vars)) {
            error(i, "Unknown variable");
            break
          }
          this.vars = removeItem(this.vars, varName);
        }
      }
      else {
        error(i, "Unknown token")
      }
    }
  }
}