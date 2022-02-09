export interface ICheckPhoneVerificationRequest {
    phoneNumber: string;
    token: string;
    langKey: string;
    locale?: string | null;
}