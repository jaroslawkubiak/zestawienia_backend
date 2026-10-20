import { IEmailCommentRow } from './IEmailCommentRow';
import { IEmailPreviewFullPayload } from './IEmailPreviewFullPayload';

export interface IEmailCommentsNotificationPayload
  extends IEmailPreviewFullPayload {
  newCommentsForPositions: IEmailCommentRow[];
  needsAttentionCommentsForPositions?: IEmailCommentRow[];
  needsAttentionHeaderForPositions?: string;
  newCommentsForFiles: IEmailCommentRow[];
  needsAttentionCommentsForFiles?: IEmailCommentRow[];
  needsAttentionHeaderForFiles?: string;
}
