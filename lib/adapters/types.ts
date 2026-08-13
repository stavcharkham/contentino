export type ReviewDraft = {
  path: string;
  title: string;
  content: string;
  score: number;
  outcome: string;
};

export type ReviewFeedback = {
  externalId: string;
  who: string;
  said: string;
  quotedText?: string;
};

export type PresentedReview = {
  surface: "claude" | "slack" | "gdocs";
  externalId: string;
  url?: string;
};

export interface ReviewAdapter {
  presentDraft(draft: ReviewDraft): Promise<PresentedReview>;
  collectFeedback(externalId: string): Promise<ReviewFeedback[]>;
  postRevision(externalId: string, content: string, message: string): Promise<void>;
}
