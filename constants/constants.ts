export const AUTHORITIES = {
    ADMIN: 'ROLE_ADMIN',
    USER: 'ROLE_USER',
    COACH: 'ROLE_COACH',
};

export enum CONVERSATION_TYPE {
    GROUP = 'GROUP',
    DUAL = 'DUAL'
}

export enum TWILIO_ROLE {
    CHANNEL_USER = 'CHANNEL_USER',
    CHANNEL_ADMIN = 'CHANNEL_ADMIN'
}

export const messages = {
    DATA_ERROR_ALERT: 'Internal Error',
};

export const APP_DATE_FORMAT = 'DD/MM/YY HH:mm';
export const APP_TIME_FORMAT = 'HH:mm';
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';


export const WHATSAPP_PREFIX = "whatsapp:+";
export const SMS_PREFIX = "+";
export const MAX_FILE_SIZE = 52428800;
export const COPY_SUCCESS_MESSAGE = "Message copied.";
export const UNEXPECTED_ERROR_MESSAGE =
    "Something went wrong. Please try again.";
export const CONNECTION_ERROR_MESSAGE = "No internet connection.";
export const NOTIFICATION_TIMEOUT = 4000;
export const ERROR_MODAL_MESSAGES = {
    ADD_PARTICIPANT: {
        title: "Unable to add participant",
        description:
            "You don’t have permission to add participants to the conversation",
    },
    CHANGE_CONVERSATION_NAME: {
        title: "Unable to save Conversation name",
        description:
            "Only creators of the Conversation can edit the Conversation name.",
    },
};
export const CONVERSATION_MESSAGES = {
    CREATED: "Conversation created.",
    NAME_CHANGED: "Conversation name changed.",
    LEFT: "You left the conversation.",
};

export const PARTICIPANT_MESSAGES = {
    ADDED: "Participant added.",
    REMOVED: "Participant removed.",
};

export const CONVERSATION_PAGE_SIZE = 10;

export const NOTIFICATION_LEVEL = {
    DEFAULT: "default",
    MUTED: "muted",
};
