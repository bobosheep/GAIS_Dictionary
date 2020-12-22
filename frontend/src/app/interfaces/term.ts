export interface Term {
    _id ?: string;
    tname : string;
    word_length : number;
    pos ?: string[];
    chuyin ?: string[];
    creator ?: string;
    created ?: Date;
    editors ?: string[];
    last_updated ?: Date;
    view_cnt ?: number;
    edit_cnt ?: number;
}
export interface TermDetail {
    _id ?: string;
    tname : string;
    word_length : number;
    pos ?: string[];
    chuyin ?: string[];
    creator ?: string;
    created ?: Date;
    editors ?: string[];
    last_updated ?: Date;
    view_cnt ?: number;
    edit_cnt ?: number;
    categories ?: string[];
    tags ?: string[];
    aliases ?: string[];
    synonym ?: string[];
    related_synonym ?: string[];
    antonym ?: string[];
    volume ?: any;
    frequency ?: number;
    meaning ?: string;
    imgs ?: any;

}