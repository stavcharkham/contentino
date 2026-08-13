import type { PresentedReview, ReviewAdapter, ReviewDraft, ReviewFeedback } from "./types";

export class ClaudeReviewAdapter implements ReviewAdapter {
  async presentDraft(draft: ReviewDraft): Promise<PresentedReview> {
    return { surface: "claude", externalId: draft.path };
  }

  async collectFeedback(): Promise<ReviewFeedback[]> {
    return [];
  }

  async postRevision(): Promise<void> {
    // The revised artifact is already visible in the active Claude conversation.
  }
}
