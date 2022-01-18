export class LangError {
  line_n: number;
  text: string;
  constructor(line_n: number, text: string){
    this.line_n = line_n
    this.text = text
  }
  out(exit: boolean){
    console.error(`\x1b[1;31mError on line ${this.line_n+1}
    ${this.text}\x1b[0;0m`)
    if (!exit) process.exit(1)
  }
}
