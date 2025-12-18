import { Schema, model, models } from 'mongoose';

export interface ISession {
    deviceId: string;
    platform: string;
    lastActive: Date;
    ip?: string;
    deviceName?: string;
}

export interface IUser {
    _id?: string;
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
    about?: string;
    status: 'online' | 'offline' | 'typing';
    lastSeen?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    twoFactorEnabled?: boolean;
    twoFactorPin?: string;
    sessions?: ISession[];
    // OTP Rate Limiting
    lastOTPSentAt?: Date;
    otpAttempts?: number;
    lockedUntil?: Date;
}

const SessionSchema = new Schema<ISession>({
    deviceId: { type: String, required: true },
    platform: { type: String, required: true },
    lastActive: { type: Date, default: Date.now },
    ip: { type: String },
    deviceName: { type: String }
});

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        phone: { type: String, unique: true, sparse: true },
        avatar: { type: String },
        about: { type: String, default: 'Hey there! I am using Chat Fresh' },
        status: { type: String, enum: ['online', 'offline', 'typing'], default: 'offline' },
        lastSeen: { type: Date, default: Date.now },
        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorPin: { type: String },
        sessions: [SessionSchema],
        // OTP Rate Limiting
        lastOTPSentAt: { type: Date },
        otpAttempts: { type: Number, default: 0 },
        lockedUntil: { type: Date }
    },
    {
        timestamps: true,
    }
);

export default models.User || model<IUser>('User', UserSchema);
