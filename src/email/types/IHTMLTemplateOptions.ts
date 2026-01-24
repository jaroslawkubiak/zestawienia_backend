import { ICommentList } from "./ICommentList";

export interface IHTMLTemplateOptions {
  header: string;
  message: ICommentList[];
  link: string;
  GDPRClause: string;
}
