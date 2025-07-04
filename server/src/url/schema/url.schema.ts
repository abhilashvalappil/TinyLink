import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema()
export class Url extends Document {
    @Prop({ required: true })
    originalUrl: string;

    @Prop({ required: true, unique: true })
    shortUrl: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdBy?: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);