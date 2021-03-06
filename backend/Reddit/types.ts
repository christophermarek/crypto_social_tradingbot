export interface reddit_comment_for_db_type {
    _id: string,
    created_utc: number,
    permalink: string,
    sentiment: number,
    keyword_map: Map<string, number>
}

export interface reddit_stream_type {
    comment_id: string;
    comment_text: string,
    created_utc: number,
    permalink: string
}

export interface api_comment_data {
    subreddit_id: string;
    approved_at_utc?: any;
    author_is_blocked: boolean;
    comment_type?: any;
    link_title: string;
    mod_reason_by?: any;
    banned_by?: any;
    ups: number;
    num_reports?: any;
    author_flair_type: string;
    total_awards_received: number;
    subreddit: string;
    link_author: string;
    likes?: any;
    replies: string;
    user_reports: any[];
    saved: boolean;
    id: string;
    banned_at_utc?: any;
    mod_reason_title?: any;
    gilded: number;
    archived: boolean;
    collapsed_reason_code?: any;
    no_follow: boolean;
    author: string;
    num_comments: number;
    can_mod_post: boolean;
    send_replies: boolean;
    parent_id: string;
    score: number;
    author_fullname: string;
    over_18: boolean;
    report_reasons?: any;
    removal_reason?: any;
    approved_by?: any;
    controversiality: number;
    body: string;
    edited: boolean;
    top_awarded_type?: any;
    downs: number;
    author_flair_css_class: string;
    is_submitter: boolean;
    collapsed: boolean;
    author_flair_richtext: any;
    author_patreon_flair: boolean;
    body_html: string;
    gildings: any;
    collapsed_reason?: any;
    distinguished?: any;
    associated_award?: any;
    stickied: boolean;
    author_premium: boolean;
    can_gild: boolean;
    link_id: string;
    unrepliable_reason?: any;
    author_flair_text_color: string;
    score_hidden: boolean;
    permalink: string;
    subreddit_type: string;
    link_permalink: string;
    name: string;
    author_flair_template_id?: any;
    subreddit_name_prefixed: string;
    author_flair_text: string;
    treatment_tags: any[];
    created: number;
    created_utc: number;
    awarders: any[];
    all_awardings: any[];
    locked: boolean;
    author_flair_background_color: string;
    collapsed_because_crowd_control?: any;
    mod_reports: any[];
    quarantine: boolean;
    mod_note?: any;
    link_url: string;
}

export interface Child {
    kind: string;
    data: api_comment_data;
}

export interface Data {
    after: string;
    dist: number;
    modhash: string;
    geo_filter: string;
    children: Child[];
    before?: any;
}

export interface RootObject {
    kind: string;
    data: Data;
}