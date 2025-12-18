import { Schema, model, models } from 'mongoose';

export interface IOTP {
    _id?: string;
    phone: string;
    otpHash: string;
    expiresAt: Date;
    attempts: number;
    sentAt: Date;
    verifiedAt?: Date;
    createdAt?: Date;
}

const OTPSchema = new Schema<IOTP>(
    {
        phone: {
            type: String,
            required: true,
            index: true
        },
        otpHash: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 } // TTL index - auto-delete when expired
        },
        attempts: {
            type: Number,
            default: 0
        },
        sentAt: {
            type: Date,
            default: Date.now
        },
        verifiedAt: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
);

// Index for faster lookups
OTPSchema.index({ phone: 1, expiresAt: 1 });

export default models.OTP || model<IOTP>('OTP', OTPSchema);
