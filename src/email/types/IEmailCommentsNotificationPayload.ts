import { ICommentForEmail } from './ICommentForEmail';
import { IEmailPreviewFullPayload } from './IEmailPreviewFullPayload';

export interface IEmailCommentsNotificationPayload
  extends IEmailPreviewFullPayload {
  newCommentsList: ICommentForEmail[];
  needsAttentionHeader?: string;
  needsAttentionCommentsList?: ICommentForEmail[];
}
