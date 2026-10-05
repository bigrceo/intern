import type { ReactNode } from "react";
import { DiscordMark, GitHubMark, GmailMark, OrbioMark, RobinhoodMark, TelegramMark, XMark } from "./marks";

/**
 * House rule: every brand named in the copy wears its logo right before the name. Splits a sentence on the brand
 * names we carry marks for ("Orbio" and the $ORBIO ticker; "X" only as a whole word after a comma/"and")
 * and puts the mark in front of each.
 */
const MARKS: Record<string, (p: { size?: number; className?: string }) => ReactNode> = {
  Robinhood: RobinhoodMark, Orbio: OrbioMark, $ORBIO: OrbioMark, Gmail: GmailMark, GitHub: GitHubMark, Telegram: TelegramMark, Discord: DiscordMark, X: XMark,
};
const SPLIT = /(Robinhood|\$ORBIO|(?<!\$)Orbio|Gmail|GitHub|Telegram|Discord|(?<=(?:, |and |on ))X(?=[\s.,]|$))/g;

export function marks(text: string, size = 14): ReactNode {
  const parts = text.split(SPLIT);
  if (parts.length === 1) return text;
  // One wrapping span, so flex parents (checks, chips) treat the sentence as a single item.
  return <span>{parts.map((p, i) => {
    const Mark = i % 2 === 1 ? MARKS[p] : undefined;
    return Mark ? (
      <span key={i} className="inline-flex items-baseline gap-[0.25em] whitespace-nowrap">
        <Mark size={size} className="relative top-[0.14em] shrink-0" />
        {p}
      </span>
    ) : (
      p
    );
  })}</span>;
}
