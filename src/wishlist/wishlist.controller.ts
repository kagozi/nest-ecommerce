import { Controller, Post, Delete, Get, Param, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Request } from 'express';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  addToWishlist(@Req() req: Request, @Param('productId') productId: number) {
    // @ts-ignore
    const userId = req.user.id;
    return this.wishlistService.addToWishlist(userId, productId);
  }

  @Delete(':productId')
  removeFromWishlist(@Req() req: Request, @Param('productId') productId: number) {
    // @ts-ignore
    const userId = req.user.id;
    return this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Get()
  viewWishlist(@Req() req: Request) {
    // @ts-ignore
    const userId = req.user.id;
    return this.wishlistService.viewWishlist(userId);
  }
}