import { memo, useMemo } from "react";

import type { CodeLine, CodeToken } from "@/data/code-snippets";
import { TOKEN_COLORS } from "@/data/code-snippets";

type TypedCodeProps = {
  lines: CodeLine[];
  charIndex: number;
  isComplete: boolean;
  showGhost?: boolean;
};

type TokenRender = { token: CodeToken; visible: number; total: number };
type LineRenderState = {
  tokens: TokenRender[];
  showCursor: boolean;
};

function computeRenderState(lines: CodeLine[], charIndex: number): LineRenderState[] {
  let remaining = charIndex;
  let cursorPlaced = false;
  const result: LineRenderState[] = [];

  for (const line of lines) {
    if (remaining <= 0 && !cursorPlaced) {
      cursorPlaced = true;
      result.push({ tokens: line.map((t) => ({ token: t, visible: 0, total: t.text.length })), showCursor: true });
      continue;
    }
    if (remaining <= 0) {
      result.push({ tokens: line.map((t) => ({ token: t, visible: 0, total: t.text.length })), showCursor: false });
      continue;
    }

    const tokens: TokenRender[] = [];
    for (const token of line) {
      const visible = Math.min(remaining, token.text.length);
      remaining -= token.text.length;
      tokens.push({ token, visible, total: token.text.length });
    }

    remaining -= 1;
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

export function TypedCode({ lines, charIndex, isComplete, showGhost }: TypedCodeProps) {
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
          {lineState.tokens.map(({ token, visible, total }, tokenIdx) => (
            <span key={tokenIdx}>
              {/* Typed portion */}
              {visible > 0 && (
                <span style={{ color: TOKEN_COLORS[token.type] }}>
                  {token.text.substring(0, visible)}
                </span>
              )}
              {/* Ghost portion — upcoming text shown faded */}
              {showGhost && visible < total && (
                <span style={{ color: TOKEN_COLORS[token.type], opacity: 0.15 }}>
                  {token.text.substring(visible)}
                </span>
              )}
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
