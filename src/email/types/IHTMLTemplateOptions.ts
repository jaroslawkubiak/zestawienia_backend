import { ICommentList } from './ICommentList';

export interface IHTMLTemplateOptions {
  header: string;
  newCommentsList: ICommentList[];
  needsAttentionCommentsList: ICommentList[];
  link: string;
  GDPRClause: string;
}
