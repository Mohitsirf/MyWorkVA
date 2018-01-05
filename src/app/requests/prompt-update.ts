export interface PromptUpdateRequest {
    on_pause?: boolean;
    preroll?: boolean;
    postroll?: boolean;
    appears_at?: number;
    config?: any;
    top_text?: string;
    bottom_text?: string;
    webhook?: string;
}
