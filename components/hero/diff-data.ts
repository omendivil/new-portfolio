type TokenType =
  | "keyword"
  | "string"
  | "type"
  | "function"
  | "number"
  | "comment"
  | "property"
  | "punctuation"
  | "plain";

export type Token = { text: string; type: TokenType };

export type DiffLine = {
  type: "context" | "addition" | "deletion" | "blank";
  tokens: Token[];
  plainText: string;
};

function kw(text: string): Token { return { text, type: "keyword" }; }
function str(text: string): Token { return { text, type: "string" }; }
function typ(text: string): Token { return { text, type: "type" }; }
function fn(text: string): Token { return { text, type: "function" }; }
function cmt(text: string): Token { return { text, type: "comment" }; }
function prop(text: string): Token { return { text, type: "property" }; }
function punc(text: string): Token { return { text, type: "punctuation" }; }
function plain(text: string): Token { return { text, type: "plain" }; }

export const DIFF_FILENAME = "about-omar.ts";
export const DIFF_ADDITIONS = 10;
export const DIFF_DELETIONS = 6;

export const DIFF_LINES: DiffLine[] = [
  {
    type: "context",
    tokens: [cmt("// about-omar.ts")],
    plainText: "// about-omar.ts",
  },
  {
    type: "blank",
    tokens: [],
    plainText: "",
  },
  {
    type: "deletion",
    tokens: [kw("const"), plain(" role "), punc("="), plain(" "), str('"Full Stack Developer"'), punc(";")],
    plainText: 'const role = "Full Stack Developer";',
  },
  {
    type: "addition",
    tokens: [kw("const"), plain(" role "), punc("="), plain(" "), str('"Frontend & iOS — motion, clarity, detail"'), punc(";")],
    plainText: 'const role = "Frontend & iOS — motion, clarity, detail";',
  },
  {
    type: "blank",
    tokens: [],
    plainText: "",
  },
  {
    type: "deletion",
    tokens: [kw("const"), plain(" skills "), punc("="), plain(" "), punc("["), str('"HTML"'), punc(","), plain(" "), str('"CSS"'), punc(","), plain(" "), str('"JavaScript"'), punc("]"), punc(";")],
    plainText: 'const skills = ["HTML", "CSS", "JavaScript"];',
  },
  {
    type: "addition",
    tokens: [kw("const"), plain(" skills "), punc("="), plain(" "), punc("["), str('"Swift"'), punc(","), plain(" "), str('"SwiftUI"'), punc(","), plain(" "), str('"React"'), punc(","), plain(" "), str('"TypeScript"'), punc("]"), punc(";")],
    plainText: 'const skills = ["Swift", "SwiftUI", "React", "TypeScript"];',
  },
  {
    type: "blank",
    tokens: [],
    plainText: "",
  },
  {
    type: "deletion",
    tokens: [kw("const"), plain(" portfolio "), punc("="), plain(" "), fn("genericTemplate"), punc("("), punc("{")],
    plainText: "const portfolio = genericTemplate({",
  },
  {
    type: "deletion",
    tokens: [plain("  "), prop("headshot"), punc(":"), plain(" "), kw("true"), punc(","), plain(" "), prop("tagline"), punc(":"), plain(" "), str('"I build things"'), punc(",")],
    plainText: '  headshot: true, tagline: "I build things",',
  },
  {
    type: "deletion",
    tokens: [punc("}"), punc(")"), punc(";")],
    plainText: "});",
  },
  {
    type: "addition",
    tokens: [kw("const"), plain(" portfolio "), punc("="), plain(" "), fn("handCrafted"), punc("("), punc("{")],
    plainText: "const portfolio = handCrafted({",
  },
  {
    type: "addition",
    tokens: [plain("  "), prop("projects"), punc(":"), plain(" "), plain("featuredWork"), punc(",")],
    plainText: "  projects: featuredWork,",
  },
  {
    type: "addition",
    tokens: [plain("  "), prop("motion"), punc(":"), plain(" "), str('"restrained"'), punc(",")],
    plainText: '  motion: "restrained",',
  },
  {
    type: "addition",
    tokens: [plain("  "), prop("detail"), punc(":"), plain(" "), str('"obsessive"'), punc(",")],
    plainText: '  detail: "obsessive",',
  },
  {
    type: "addition",
    tokens: [punc("}"), punc(")"), punc(";")],
    plainText: "});",
  },
  {
    type: "blank",
    tokens: [],
    plainText: "",
  },
  {
    type: "deletion",
    tokens: [kw("export"), plain(" "), kw("default"), plain(" "), typ("BoringPortfolio"), punc(";")],
    plainText: "export default BoringPortfolio;",
  },
  {
    type: "addition",
    tokens: [kw("export"), plain(" "), kw("default"), plain(" "), typ("OmarMendivil"), punc(";")],
    plainText: "export default OmarMendivil;",
  },
];
