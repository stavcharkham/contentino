export type PromotedRule = { id: string; source: string; violation: (text: string) => boolean; message: string };

export const promotedRules: PromotedRule[] = [
  {
    id: "specific-action-label",
    source: "product-microcopy/action-verb",
    violation: (text) => /\bclick here\b/i.test(text),
    message: "generic “click here” instead of the specific action",
  },
];
