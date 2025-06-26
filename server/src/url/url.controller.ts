import { Controller, Body, Post, Get, Req, Res, UseGuards, Param, } from "@nestjs/common";
import { Response } from "express";
import { CreateUrlDto } from "./dto/url.dto";
import { UrlService } from "./url.service";
import { AuthGuard } from "@nestjs/passport";
import { Url } from "./schema/url.schema";

@Controller('url')
export class UrlController {
    constructor(private urlService: UrlService) {}

    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async createUrl(@Body() CreateUrlDto: CreateUrlDto, @Req() req): Promise<Url>{
        const userId = req.user._id.toString()
        return this.urlService.createUrl(CreateUrlDto, userId)
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getUrls(@Req() req, @Res() res: Response): Promise<void> {
        const userId = req.user._id.toString();
        const urls = await this.urlService.getUserUrls(userId);
        res.status(200).json(urls);
    }

    @Get(':shortId')
    // @UseGuards(AuthGuard('jwt'))
    async redirectToUrl(@Param('shortId') shortId: string, @Res() res:Response): Promise< void > {
        const originalUrl = await this.urlService.getOriginalUrl(shortId);
        res.redirect(originalUrl);
    }
}