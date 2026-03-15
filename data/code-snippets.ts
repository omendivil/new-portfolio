export type TokenType =
  | "keyword"
  | "string"
  | "number"
  | "type"
  | "function"
  | "comment"
  | "operator"
  | "property"
  | "decorator"
  | "punctuation"
  | "plain";

export type CodeToken = { text: string; type: TokenType };
export type CodeLine = CodeToken[];

export type CodeLanguage = "tsx" | "swift" | "jsx" | "bash";

export type CodeSnippet = {
  filename: string;
  language: CodeLanguage;
  projectName: string;
  lines: CodeLine[];
  typingSpeed?: number;
};

// Token helpers
function kw(t: string): CodeToken { return { text: t, type: "keyword" }; }
function str(t: string): CodeToken { return { text: t, type: "string" }; }
function num(t: string): CodeToken { return { text: t, type: "number" }; }
function typ(t: string): CodeToken { return { text: t, type: "type" }; }
function fn(t: string): CodeToken { return { text: t, type: "function" }; }
function op(t: string): CodeToken { return { text: t, type: "operator" }; }
function prop(t: string): CodeToken { return { text: t, type: "property" }; }
function punc(t: string): CodeToken { return { text: t, type: "punctuation" }; }
function plain(t: string): CodeToken { return { text: t, type: "plain" }; }

export const CODE_SNIPPETS: CodeSnippet[] = [
  // 1. AnimatedText — Groundworks Website (TypeScript/React)
  {
    filename: "AnimatedText.tsx",
    language: "tsx",
    projectName: "Groundworks Website",
    lines: [
      [kw("export"), plain(" "), kw("function"), plain(" "), fn("AnimatedText"), punc("("), punc("{")],
      [plain("  "), prop("text"), punc(","), plain(" "), prop("className"), plain(" "), op("="), plain(" "), str('""'), punc(",")],
      [plain("  "), prop("delay"), plain(" "), op("="), plain(" "), num("0"), punc(","), plain(" "), prop("stagger"), plain(" "), op("="), plain(" "), num("0.05"), punc(",")],
      [punc("}"), op(":"), plain(" "), typ("AnimatedTextProps"), punc(")"), plain(" "), punc("{")],
      [plain("  "), kw("const"), plain(" words "), op("="), plain(" text."), fn("split"), punc("("), str('" "'), punc(")"), punc(";")],
      [plain("  "), kw("const"), plain(" ref "), op("="), plain(" "), fn("useRef"), op("<"), typ("HTMLElement"), op(">"), punc("("), kw("null"), punc(")"), punc(";")],
      [plain("  "), kw("const"), plain(" "), punc("["), plain("isVisible"), punc(","), plain(" setIsVisible"), punc("]"), plain(" "), op("="), plain(" "), fn("useState"), punc("("), kw("false"), punc(")"), punc(";")],
      [plain("")],
      [plain("  "), kw("return"), plain(" "), punc("(")],
      [plain("    "), op("<"), typ("Tag"), plain(" "), prop("ref"), op("="), punc("{"), plain("ref"), punc("}"), op(">")],
      [plain("      "), punc("{"), plain("words."), fn("map"), punc("("), punc("("), plain("word"), punc(","), plain(" i"), punc(")"), plain(" "), op("=>"), plain(" "), punc("(")],
      [plain("        "), op("<"), plain("span"), plain(" "), prop("key"), op("="), punc("{"), str("`${word}-${i}`"), punc("}")],
      [plain("          "), prop("style"), op("="), punc("{"), punc("{"), plain(" "), prop("opacity"), op(":"), plain(" isVisible "), op("?"), plain(" "), num("1"), plain(" "), op(":"), plain(" "), num("0"), plain(" "), punc("}"), punc("}")],
      [plain("        "), op(">"), punc("{"), plain("word"), punc("}"), op("<"), op("/"), plain("span"), op(">")],
      [plain("      "), punc(")"), punc(")"), punc("}")],
      [plain("    "), op("<"), op("/"), typ("Tag"), op(">")],
      [plain("  "), punc(")"), punc(";")],
      [punc("}")],
    ],
  },

  // 2. MessageRow — Atlas Chat App (Swift/SwiftUI)
  {
    filename: "MessageRow.swift",
    language: "swift",
    projectName: "Atlas Chat App",
    lines: [
      [kw("struct"), plain(" "), typ("MessageRow"), op(":"), plain(" "), typ("View"), plain(" "), punc("{")],
      [plain("    "), kw("let"), plain(" message"), op(":"), plain(" "), typ("Message")],
      [plain("")],
      [plain("    "), kw("var"), plain(" body"), op(":"), plain(" "), kw("some"), plain(" "), typ("View"), plain(" "), punc("{")],
      [plain("        "), typ("HStack"), plain(" "), punc("{")],
      [plain("            "), kw("if"), plain(" isUser "), punc("{"), plain(" "), typ("Spacer"), punc("("), punc(")"), plain(" "), punc("}")],
      [plain("            "), typ("Text"), punc("("), plain("message.content"), punc(")")],
      [plain("                ."), fn("foregroundColor"), punc("("), plain("isUser")],
      [plain("                    "), op("?"), plain(" ChatTheme."), prop("userText")],
      [plain("                    "), op(":"), plain(" ChatTheme."), prop("aiText"), punc(")")],
      [plain("                ."), fn("padding"), punc("("), num("12"), punc(")")],
      [plain("                ."), fn("background"), punc("("), plain("isUser "), op("?"), plain(" ChatTheme."), prop("userBubble"), plain(" "), op(":"), plain(" ChatTheme."), prop("aiBubble"), punc(")")],
      [plain("                ."), fn("cornerRadius"), punc("("), num("16"), punc(")")],
      [plain("            "), kw("if"), plain(" "), op("!"), plain("isUser "), punc("{"), plain(" "), typ("Spacer"), punc("("), punc(")"), plain(" "), punc("}")],
      [plain("        "), punc("}")],
      [plain("    "), punc("}")],
      [punc("}")],
    ],
  },

  // 3. Infinite scroll — Anime YouTube App (JavaScript/React)
  {
    filename: "List.js",
    language: "jsx",
    projectName: "Anime YouTube App",
    lines: [
      [kw("const"), plain(" lastAnime "), op("="), plain(" "), fn("useCallback"), punc("("), punc("("), plain("node"), punc(")"), plain(" "), op("=>"), plain(" "), punc("{")],
      [plain("  "), kw("if"), plain(" "), punc("("), op("!"), plain("node "), op("||"), plain(" isObsLoading.current"), punc(")"), plain(" "), kw("return"), punc(";")],
      [plain("  "), kw("if"), plain(" "), punc("("), plain("observer.current"), punc(")"), plain(" observer.current."), fn("disconnect"), punc("("), punc(")"), punc(";")],
      [plain("  observer.current "), op("="), plain(" "), kw("new"), plain(" "), typ("IntersectionObserver"), punc("("), punc("("), plain("entry"), punc(")"), plain(" "), op("=>"), plain(" "), punc("{")],
      [plain("    "), kw("if"), plain(" "), punc("("), plain("entry"), punc("["), num("0"), punc("]"), plain(".isIntersecting"), punc(")"), plain(" "), punc("{")],
      [plain("      "), kw("const"), plain(" now "), op("="), plain(" "), typ("Date"), plain("."), fn("now"), punc("("), punc(")"), punc(";")],
      [plain("      "), kw("if"), plain(" "), punc("("), plain("now "), op("-"), plain(" lastFetchAt.current "), op("<"), plain(" COOLDOWN_MS"), punc(")"), plain(" "), kw("return"), punc(";")],
      [plain("")],
      [plain("      lastFetchAt.current "), op("="), plain(" now"), punc(";")],
      [plain("      isObsLoading.current "), op("="), plain(" "), kw("true"), punc(";")],
      [plain("      "), fn("setPage"), punc("("), plain("page "), op("=>"), plain(" page "), op("+"), plain(" "), num("1"), punc(")"), punc(";")],
      [plain("      observer.current."), fn("disconnect"), punc("("), punc(")"), punc(";")],
      [plain("    "), punc("}")],
      [plain("  "), punc("}"), punc(")"), punc(";")],
      [plain("  observer.current."), fn("observe"), punc("("), plain("node"), punc(")"), punc(";")],
      [punc("}"), punc(","), plain(" "), punc("["), punc("]"), punc(")"), punc(";")],
    ],
  },

  // 4. Image cache — Appetizer App (Swift)
  {
    filename: "NetworkManager.swift",
    language: "swift",
    projectName: "Appetizer App",
    lines: [
      [kw("func"), plain(" "), fn("downloadImage"), punc("("), plain("fromURLString urlString"), op(":"), plain(" "), typ("String"), punc(")"), plain(" "), kw("async"), plain(" "), kw("throws"), plain(" "), op("->"), plain(" "), typ("Image"), plain(" "), punc("{")],
      [plain("    "), kw("guard"), plain(" "), kw("let"), plain(" url "), op("="), plain(" "), typ("URL"), punc("("), plain("string"), op(":"), plain(" urlString"), punc(")"), plain(" "), kw("else"), plain(" "), punc("{")],
      [plain("        "), kw("throw"), plain(" APError."), prop("invalidURL")],
      [plain("    "), punc("}")],
      [plain("")],
      [plain("    "), kw("if"), plain(" "), kw("let"), plain(" cached "), op("="), plain(" imageCache."), fn("object"), punc("("), plain("forKey"), op(":"), plain(" key"), punc(")"), plain(" "), punc("{")],
      [plain("        "), kw("return"), plain(" "), typ("Image"), punc("("), plain("uiImage"), op(":"), plain(" cached"), punc(")")],
      [plain("    "), punc("}")],
      [plain("")],
      [plain("    "), kw("let"), plain(" "), punc("("), plain("data"), punc(","), plain(" response"), punc(")"), plain(" "), op("="), plain(" "), kw("try"), plain(" "), kw("await"), plain(" "), typ("URLSession"), plain(".shared."), fn("data"), punc("("), plain("for"), op(":"), plain(" request"), punc(")")],
      [plain("    "), kw("let"), plain(" cached "), op("="), plain(" "), typ("CachedURLResponse"), punc("("), plain("response"), op(":"), plain(" response"), punc(","), plain(" data"), op(":"), plain(" data"), punc(")")],
      [plain("    cache."), fn("storeCachedResponse"), punc("("), plain("cached"), punc(","), plain(" for"), op(":"), plain(" request"), punc(")")],
      [plain("")],
      [plain("    "), kw("guard"), plain(" "), kw("let"), plain(" uiImage "), op("="), plain(" "), typ("UIImage"), punc("("), plain("data"), op(":"), plain(" data"), punc(")"), plain(" "), kw("else"), plain(" "), punc("{")],
      [plain("        "), kw("throw"), plain(" APError."), prop("invalidData")],
      [plain("    "), punc("}")],
      [plain("")],
      [plain("    imageCache."), fn("setObject"), punc("("), plain("uiImage"), punc(","), plain(" forKey"), op(":"), plain(" key"), punc(")")],
      [plain("    "), kw("return"), plain(" "), typ("Image"), punc("("), plain("uiImage"), op(":"), plain(" uiImage"), punc(")")],
      [punc("}")],
    ],
  },

  // 5. Config parser — Claude Notifier (Bash)
  {
    filename: "config.sh",
    language: "bash",
    projectName: "Claude Notifier",
    lines: [
      [fn("load_config"), punc("("), punc(")"), plain(" "), punc("{")],
      [plain("  "), punc("["), punc("["), plain(" "), op("!"), plain(" "), op("-"), plain("f "), str('"$CLAUDE_NOTIFIER_CONF"'), plain(" "), punc("]"), punc("]"), plain(" "), op("&&"), plain(" "), kw("return"), plain(" "), num("0")],
      [plain("")],
      [plain("  "), kw("while"), plain(" "), typ("IFS"), op("="), plain(" "), fn("read"), plain(" "), op("-"), plain("r line"), punc(";"), plain(" "), kw("do")],
      [plain("    "), punc("["), punc("["), plain(" "), str('"$line"'), plain(" "), op("=~"), plain(" "), str("^[[:space:]]*#"), plain(" "), punc("]"), punc("]"), plain(" "), op("&&"), plain(" "), kw("continue")],
      [plain("    "), punc("["), punc("["), plain(" "), op("-"), plain("z "), str('"${line// /}"'), plain(" "), punc("]"), punc("]"), plain(" "), op("&&"), plain(" "), kw("continue")],
      [plain("")],
      [plain("    "), kw("local"), plain(" key"), op("="), str('"${line%%=*}"')],
      [plain("    "), kw("local"), plain(" value"), op("="), str('"${line#*=}"')],
      [plain("")],
      [plain("    "), kw("case"), plain(" "), str('"$key"'), plain(" "), kw("in")],
      [plain("      NOTIFY_BLINK"), op("|"), plain("NOTIFY_COLOR"), punc(")")],
      [plain("        "), punc("["), punc("["), plain(" "), str('"$value"'), plain(" "), op("!="), plain(" "), str('"true"'), plain(" "), punc("]"), punc("]"), plain(" "), op("&&"), plain(" "), kw("continue"), plain(" "), punc(";"), punc(";")],
      [plain("      COLOR_PERMISSION"), op("|"), plain("COLOR_DONE"), punc(")")],
      [plain("        "), punc("["), punc("["), plain(" "), str('"$value"'), plain(" "), op("=~"), plain(" "), str("^#[0-9a-fA-F]{6}$"), plain(" "), punc("]"), punc("]"), plain(" "), op("||"), plain(" "), kw("continue"), plain(" "), punc(";"), punc(";")],
      [plain("    "), kw("esac")],
      [plain("    "), fn("printf"), plain(" "), op("-"), plain("v "), str('"$key"'), plain(" "), str("'%s'"), plain(" "), str('"$value"')],
      [plain("  "), kw("done"), plain(" "), op("<"), plain(" "), str('"$CLAUDE_NOTIFIER_CONF"')],
      [punc("}")],
    ],
  },
];

// Bonus snippets — revealed when user clicks "+" on the tab bar
export const BONUS_SNIPPETS: CodeSnippet[] = [
  // Order.swift — Appetizer App
  {
    filename: "Order.swift",
    language: "swift",
    projectName: "Appetizer App",
    lines: [
      [kw("final"), plain(" "), kw("class"), plain(" "), typ("Order"), op(":"), plain(" "), typ("ObservableObject"), plain(" "), punc("{")],
      [plain("    "), dec("@Published"), plain(" "), kw("var"), plain(" items"), op(":"), plain(" "), punc("["), typ("Appetizer"), punc("]"), plain(" "), op("="), plain(" "), punc("["), punc("]")],
      [plain("")],
      [plain("    "), kw("var"), plain(" totalPrice"), op(":"), plain(" "), typ("Double"), plain(" "), punc("{")],
      [plain("        items."), fn("reduce"), punc("("), num("0"), punc(")"), plain(" "), punc("{"), plain(" $0 "), op("+"), plain(" $1.price "), punc("}")],
      [plain("    "), punc("}")],
      [plain("")],
      [plain("    "), kw("func"), plain(" "), fn("add"), punc("("), plain("_ appetizer"), op(":"), plain(" "), typ("Appetizer"), punc(")"), plain(" "), punc("{")],
      [plain("        items."), fn("append"), punc("("), plain("appetizer"), punc(")")],
      [plain("    "), punc("}")],
      [plain("")],
      [plain("    "), kw("func"), plain(" "), fn("deleteItems"), punc("("), plain("at offsets"), op(":"), plain(" "), typ("IndexSet"), punc(")"), plain(" "), punc("{")],
      [plain("        items."), fn("remove"), punc("("), plain("atOffsets"), op(":"), plain(" offsets"), punc(")")],
      [plain("    "), punc("}")],
      [punc("}")],
    ],
  },

  // Slot.js — Anime YouTube App
  {
    filename: "Slot.js",
    language: "jsx",
    projectName: "Anime YouTube App",
    lines: [
      [kw("export"), plain(" "), kw("default"), plain(" "), kw("function"), plain(" "), fn("Slot"), punc("("), punc("{"), plain(" anime "), punc("}"), punc(")"), plain(" "), punc("{")],
      [plain("  "), kw("if"), plain(" "), punc("("), op("!"), plain("anime"), punc(")"), plain(" "), punc("{")],
      [plain("    "), kw("return"), plain(" "), punc("(")],
      [plain("      "), op("<"), plain("div"), op(">")],
      [plain("        "), op("<"), plain("div "), prop("className"), op("="), str('"aspect-2/3 rounded-sm bg-[#19222E]"'), plain(" "), op("/"), op(">")],
      [plain("      "), op("<"), op("/"), plain("div"), op(">")],
      [plain("    "), punc(")")],
      [plain("  "), punc("}")],
      [plain("  "), kw("return"), plain(" "), punc("(")],
      [plain("    "), op("<"), plain("div"), op(">")],
      [plain("      "), op("<"), plain("img "), prop("src"), op("="), punc("{"), plain("anime.images.jpg.image_url"), punc("}")],
      [plain("        "), prop("className"), op("="), str('"aspect-2/3 rounded-sm"'), plain(" "), op("/"), op(">")],
      [plain("      "), op("<"), plain("p "), prop("className"), op("="), str('"line-clamp-2 text-xs"'), op(">")],
      [plain("        "), punc("{"), plain("anime.title_english"), punc("}")],
      [plain("      "), op("<"), op("/"), plain("p"), op(">")],
      [plain("    "), op("<"), op("/"), plain("div"), op(">")],
      [plain("  "), punc(")")],
      [punc("}")],
    ],
  },
  // sendMessage — Atlas Chat App (Swift async)
  {
    filename: "ChatViewModel.swift",
    language: "swift",
    projectName: "Atlas Chat App",
    lines: [
      [kw("func"), plain(" "), fn("sendMessage"), punc("("), plain("_ content"), op(":"), plain(" "), typ("String"), punc(")"), plain(" "), kw("async"), plain(" "), punc("{")],
      [plain("    "), kw("guard"), plain(" "), op("!"), plain("content."), fn("isEmpty"), plain(" "), kw("else"), plain(" "), punc("{"), plain(" "), kw("return"), plain(" "), punc("}")],
      [plain("")],
      [plain("    "), kw("let"), plain(" userMsg "), op("="), plain(" "), typ("Message"), punc("("), prop("role"), op(":"), plain(" .user"), punc(","), plain(" "), prop("content"), op(":"), plain(" content"), punc(")")],
      [plain("    messages."), fn("append"), punc("("), plain("userMsg"), punc(")")],
      [plain("    isLoading "), op("="), plain(" "), kw("true")],
      [plain("")],
      [plain("    "), kw("do"), plain(" "), punc("{")],
      [plain("      "), kw("let"), plain(" reply "), op("="), plain(" "), kw("try"), plain(" "), kw("await"), plain(" chatService."), fn("sendMessage"), punc("("), plain("content"), punc(")")],
      [plain("      messages."), fn("append"), punc("("), plain("reply"), punc(")")],
      [plain("    "), punc("}"), plain(" "), kw("catch"), plain(" "), punc("{")],
      [plain("      messages."), fn("removeAll"), plain(" "), punc("{"), plain(" $0.id "), op("=="), plain(" userMsg.id "), punc("}")],
      [plain("      errorMessage "), op("="), plain(" error."), prop("localizedDescription")],
      [plain("    "), punc("}")],
      [plain("    isLoading "), op("="), plain(" "), kw("false")],
      [punc("}")],
    ],
  },

  // blink.sh — Claude Notifier (Bash)
  {
    filename: "blink.sh",
    language: "bash",
    projectName: "Claude Notifier",
    lines: [
      [fn("run_blink"), punc("("), punc(")"), plain(" "), punc("{")],
      [plain("  "), kw("local"), plain(" state"), op("="), str('"$1"')],
      [plain("  "), fn("_kill_previous_blink")],
      [plain("")],
      [plain("  "), kw("case"), plain(" "), str('"$state"'), plain(" "), kw("in")],
      [plain("    permission"), punc(")")],
      [plain("      "), kw("for"), plain(" _ "), kw("in"), plain(" "), num("1"), plain(" "), num("2"), plain(" "), num("3"), punc(";"), plain(" "), kw("do")],
      [plain("        "), fn("kitty_set_tab_color"), plain(" active_bg"), op("="), str('"#ffffff"')],
      [plain("        "), fn("sleep"), plain(" "), str('"$fast"'), punc(";"), plain(" "), fn("kitty_set_tab_color"), plain(" active_bg"), op("="), plain("NONE")],
      [plain("      "), kw("done"), plain(" "), punc(";"), punc(";")],
      [plain("    done"), op("|"), plain("idle"), punc(")")],
      [plain("      "), fn("kitty_set_tab_color"), plain(" active_bg"), op("="), str('"#ffffff"')],
      [plain("      "), fn("sleep"), plain(" "), str('"$slow"'), plain(" "), punc(";"), punc(";")],
      [plain("  "), kw("esac")],
      [punc("}")],
    ],
  },
];

// Helper for bonus snippets that need decorator type
function dec(t: string): CodeToken { return { text: t, type: "decorator" }; }

export const CODE_EDITOR_DWELL_TIME = 4000;

export const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: "var(--syn-keyword)",
  string: "var(--syn-string)",
  number: "var(--syn-number)",
  type: "var(--syn-type)",
  function: "var(--syn-function)",
  comment: "var(--syn-comment)",
  operator: "var(--syn-operator, var(--syn-plain))",
  property: "var(--syn-property)",
  decorator: "var(--syn-keyword)",
  punctuation: "var(--syn-punctuation)",
  plain: "var(--syn-plain)",
};
