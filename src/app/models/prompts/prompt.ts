export interface Prompt {
    id: number;
    unique_id: string;
    top_text: string;
    bottom_text: string;
    type: CTA;
    on_pause: boolean;
    preroll: boolean;
    postroll: boolean;
    webhook: string;
    appears_at: number | null;
}

export const getTitle = (prompt: Prompt) => {
    switch (prompt.type) {
        case CTA.AUTO_FORWARD:
            return 'Auto Forward';
        case CTA.CLICK_TO_CALL:
            return 'Click To Call';
        case CTA.EMAIL:
            return 'Email Collector';
        case CTA.RAW_HTML:
            return 'Raw Html';
        case CTA.GO_TO_WEBINAR:
            return 'Go To Webinar';
        case CTA.AMAZON_ASSOCIATES:
            return 'Amazon Associates';
        case CTA.SOCIAL_SHARE:
            return 'Social Share';
        case CTA.PASSWORD:
            return 'Password Protect';
        case CTA.DONATION:
            return 'Donation';
        case CTA.WUFOO:
            return 'Wufoo';
        case CTA.SURVEY_MONKEY:
            return 'Survey Monkey';
        case CTA.SMS_QUERY:
            return 'Sms Query';
        case CTA.INFORMATION_SMS:
            return 'Information Sms';
        case CTA.EMAIL_QUERY:
            return 'Email Query';
        default:
            return 'Call to Action';
    }
}

export enum CTA {
    AUTO_FORWARD = 'auto_forward',
    CLICK_TO_CALL = 'click_to_call',
    EMAIL = 'email',
    RAW_HTML = 'raw_html',
    GO_TO_WEBINAR = 'go_to_webinar',
    AMAZON_ASSOCIATES = 'amazon_associates',
    SOCIAL_SHARE = 'social_share',
    PASSWORD = 'password',
    DONATION = 'donation',
    WUFOO = 'wufoo',
    SURVEY_MONKEY = 'survey_monkey',
    SMS_QUERY = 'sms_query',
    INFORMATION_SMS = 'information_sms',
    EMAIL_QUERY = 'email_query',
    INFORMATION_EMAIL = 'information_email',
    VCITA = 'vcita',
    SHARE = 'share',
    GUMROAD = 'gumroad',
    TRACKING_PIXEL = 'tracking_pixel',
    YOUTUBE_SUBSCRIBE = 'youtube_subscribe',
    STRIPE_RELAY = 'stripe_relay',
    CUSTOM_FORM = 'custom_form',
    HUBSPOT_CRM = 'hubspot_crm',
    INFUSIONSOFT_CRM = 'infusionsoft_crm',
    VAETAS_SIGNUP = 'vaetas_signup',
    CREATE_BUTTON = 'button'
}
