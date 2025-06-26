import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as shortid from 'shortid';
import { Url } from './schema/url.schema';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { CreateUrlDto } from './dto/url.dto'; 

@Injectable()
export class UrlService {
    constructor(
        @InjectModel(Url.name) private urlModel: Model<Url>
    ) {}

    async createUrl(CreateUrlDto: CreateUrlDto, userId: string): Promise<Url >{
        
        const existingUrl = await this.urlModel.findOne({ originalUrl: CreateUrlDto.originalUrl,createdBy: userId})
        if(existingUrl){
            return existingUrl;
        }

        const shortUrl = shortid.generate();
        const savedUrl = await this.urlModel.create({
            originalUrl: CreateUrlDto.originalUrl,
            shortUrl,
            createdBy: userId
        })
        return savedUrl;
    }

    async getUserUrls(userId: string): Promise<Url[]> {
        const urls = await this.urlModel
          .find({ createdBy: userId })
          .sort({ createdAt: -1 }) 
          .limit(1)
          .exec();
        
        if(!urls.length) {
            throw new NotFoundException('No links found. Try shortening your first URL!');
        }
        return urls;
    }

    async getOriginalUrl(shortId: string): Promise<string> {
        const url = await this.urlModel.findOne({  shortUrl: shortId });
        if (!url){
            throw new NotFoundException('Short URL not found');
        }
        return url.originalUrl;
    }
    
}