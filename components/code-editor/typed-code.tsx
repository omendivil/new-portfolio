import { memo, useMemo } from "react";

import type { CodeLine, CodeToken } from "@/data/code-snippets";
import { TOKEN_COLORS } from "@/data/code-snippets";

type TypedCodeProps = {
  lines: CodeLine[];
  charIndex: number;
  isComplete: boolean;
};

type LineRenderState = {
  tokens: Array<{ token: CodeToken; visible: number }>;
  showCursor: boolean;
};

function computeRenderState(lines: CodeLine[], charIndex: number): LineRenderState[] {
  let remaining = charIndex;
  let cursorPlaced = false;
  const result: LineRenderState[] = [];

  for (const line of lines) {
    if (remaining <= 0 && !cursorPlaced) {
      cursorPlaced = true;
      result.push({ tokens: [], showCursor: true });
      continue;
    }
    if (remaining <= 0) {
      result.push({ tokens: [], showCursor: false });
      continue;
    }

    const tokens: LineRenderState["tokens"] = [];
    for (const token of line) {
      if (remaining <= 0) break;
      const visible = Math.min(remaining, token.text.length);
      remaining -= token.text.length;
      tokens.push({ token, visible });
    }

    remaining -= 1; // newline
    const isCurrentLine = remaining <= 0 && !cursorPlaced;
    if (isCurrentLine) cursorPlaced = true;

    result.push({ tokens, showCursor: isCurrentLine });
  }

  return result;
}

const CompletedLine = memo(function CompletedLine({ tokens }: { tokens: CodeToken[] }) {
  return (
    <div className="code-line min-h-[1.7em]">
      {tokens.map((t, i) => (
        <span key={i} style={{ color: TOKEN_COLORS[t.type] }}>
          {t.text}
        </span>
      ))}
    </div>
  );
});

export function TypedCode({ lines, charIndex, isComplete }: TypedCodeProps) {
  const renderState = useMemo(
    () => computeRenderState(lines, charIndex),
    [lines, charIndex],
  );

  if (isComplete) {
    return (
      <>
        {lines.map((line, i) => (
          <CompletedLine key={i} tokens={line} />
        ))}
        <span className="inline-block h-[1em] w-[2px] bg-[#528bff] animate-[blink_1s_step-end_infinite]" />
      </>
    );
  }

  return (
    <>
      {renderState.map((lineState, lineIdx) => (
        <div key={lineIdx} className="code-line min-h-[1.7em]">
          {lineState.tokens.map(({ token, visible }, tokenIdx) => (
            <span key={tokenIdx} style={{ color: TOKEN_COLORS[token.type] }}>
              {token.text.substring(0, visible)}
            </span>
          ))}
          {lineState.showCursor && (
            <span className="inline-block h-[1em] w-[2px] bg-[#528bff]" />
          )}
        </div>
      ))}
    </>
  );
}
