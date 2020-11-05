export interface ExtensionParams {
    method: number,
    iteration: number,
    model: string, 
    threshold: number,
    n_result: number,
    coverage?: number
}
export interface similarWordParams {
    term : string,
    n_results ?: number,
    cid ?: string,
    model ?: string,
    with_sim ?: boolean,
    f_removed ?: boolean,
    f_exist ?: boolean
}