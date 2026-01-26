export interface IComment {
  id: number;
  comment: string;
  authorType: 'client' | 'user';
  authorId: number;
  seenAt: Date;
  needsAttention: boolean;
  createdAt: string;
  createdAtTimestamp: number;
  positionId: { id: number };
  setId: { id: number };
  authorName?: string;
  notificationSend?: boolean;
  avatar?: string;
}
