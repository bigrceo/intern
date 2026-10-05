/**
 * POINT UNIQUE DE MARQUE. Nom, accroche, domaine, réseaux, token : tout le site lit ici.
 * Changer de nom = changer ce fichier (+ le dessin dans components/logo.tsx).
 */
export const BRAND = {
  name: "Intern",
  /** Ce qu'on appelle un agent dans l'interface. */
  noun: "intern",
  nounPlural: "interns",
  ticker: "INTERN",
  domain: process.env.NEXT_PUBLIC_DOMAIN ?? "intern.money",
  tagline: "Your bag runs an agent.",
  description:
    "Write what you want in one sentence. An AI intern does it for you around the clock, paid by what your staked $ORBIO earns. No card, nothing to set up.",
  /** Contrat du token de la marque ; vide = les liens d'achat se masquent et le bloc dit « posted at launch ». */
  token: process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "",
  /** Achat : la page Pons du token (NEXT_PUBLIC_BUY_URL) ; à défaut, ETH → token sur Uniswap, Robinhood Chain. */
  buyUrl: process.env.NEXT_PUBLIC_BUY_URL || (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ? `https://app.uniswap.org/swap?chain=robinhood&inputCurrency=NATIVE&outputCurrency=${process.env.NEXT_PUBLIC_TOKEN_ADDRESS}` : ""),
  /** Où et contre quoi le token trade, affiché à côté du CA. */
  market: process.env.NEXT_PUBLIC_MARKET_LABEL || "Launched on Pons · paired with ETH",
  chartUrl: process.env.NEXT_PUBLIC_CHART_URL || (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ? `https://dexscreener.com/robinhood/${process.env.NEXT_PUBLIC_TOKEN_ADDRESS}` : ""),
  /** Features that need extra setup stay hidden until switched on (Gmail OAuth verified, the computers host running). */
  features: {
    inbox: process.env.NEXT_PUBLIC_GMAIL === "1",
    threads: process.env.NEXT_PUBLIC_THREADS === "1",
  },
  social: {
    x: process.env.NEXT_PUBLIC_X_URL ?? "",
    telegramBot: process.env.TELEGRAM_BOT_USERNAME ?? process.env.NEXT_PUBLIC_TELEGRAM_BOT ?? "",
    github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
  },
} as const;
