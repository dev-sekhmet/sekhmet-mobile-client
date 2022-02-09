import {VerificationChannel} from "../enumerations/verification-channel.model";

export interface IStartPhoneVerificationRequest {
    phoneNumber: string;
    channel: VerificationChannel;
    locale?: string | null;
}