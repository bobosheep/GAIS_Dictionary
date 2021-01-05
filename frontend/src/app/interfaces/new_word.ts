export interface NewWord {
    _id ?: string;
    tname : string;
    word_length : number;
    creator ?: string;
    created ?: Date;
    frequency : number;
    accepts ?: string[];
    rejects ?: string[]
    check_time ?: Date;
    checked ?: boolean;
    is_new_term ?: boolean;
}