export interface IInboxItem extends IInboxItemContent {
    userID: string;
    created_at: Date;
    _id: string;
}

export enum InboxItemType {
    BlogPostComment = "blog-post-comment",
    BlogPostReply = "blog-post-reply",
}

export interface IInboxItemContent {
    from?: string;
    subject: string;
    type: InboxItemType;
    link?: string;
    body?: string;
    read?: boolean;
}
