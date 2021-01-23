export interface Category {
    _id ?: string;
    cname: string;
    parent?: string;
    children?: Category[];
    terms?: string[]; 
    terms_cnt?: number;
}

export interface CategoryDetail {
    _id ?: string;
    cname: string;
    parent?: string;
    children?: Category[];
    is_root?: boolean;
    root_cat?: string;
    seeds?: string[];
    terms?: string[];
    childmutex?: boolean;
    created?: Date;
    creator?: string;
    editors?: string[];
    last_updated?: Date;
    view_cnt?: Number;
    edit_cnt?: Number;
    ancestors?: string[];
    image_urls?: string;
}
