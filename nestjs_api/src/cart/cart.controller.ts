import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException, Put, Res
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { Cookies } from "../util/cookies/cookies.decorator";
import { CartDto } from "./dto/cart.dto";
import { Auth } from "../auth/auth.decorator";
import { UserDto } from "../users/dto/user.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

@ApiTags("cart")
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService,
              private readonly configService: ConfigService) {
  }

  @Get()
  findAll(@Pagination() pageable: Pageable,
          @Cookies({ name: "cart", type: CartDto }) cartDtos: CartDto[], @Auth() auth: UserDto) {
    let [cart, total] = this.cartService.findAll(pageable, cartDtos ?? []);
    return {
      content: cart,
      total: Math.ceil(total / pageable.size),
      pageable
    };
  }

  @Post()
  async create(@Body() createCartDto: CreateCartDto,
               @Cookies({ name: "cart", type: CartDto }) cartDtos: CartDto[],
               @Auth() auth: UserDto, @Res({ passthrough: true }) res: Response) {
    cartDtos = await this.cartService.create(createCartDto, cartDtos ?? []);
    res.cookie("cart", JSON.stringify(cartDtos), {
      httpOnly: true,
      secure: true,
      domain: (new URL(this.configService.get("FRONTEND_URL"))).hostname
    });
  };

  @Put(":dishId")
  updateByDish(@Param("dishId") dishId: number, @Body() updateCartDto: UpdateCartDto,
               @Cookies({ name: "cart", type: CartDto }) cartDtos: CartDto[],
               @Auth() auth: UserDto, @Res({ passthrough: true }) res: Response) {
    let cartDto = this.cartService.findByDish(dishId, cartDtos);
    if (!cartDto)
      throw new NotFoundException(`Cart dto with dish id "${dishId}" doesn't exist!`);
    cartDtos = this.cartService.updateByDish(dishId, updateCartDto, cartDtos ?? []);
    res.cookie("cart", JSON.stringify(cartDtos), {
      httpOnly: true,
      secure: true,
      domain: (new URL(this.configService.get("FRONTEND_URL"))).hostname
    });
  }

  @Delete(":dishId")
  removeByDish(@Param("dishId") dishId: number,
               @Cookies({ name: "cart", type: CartDto }) cartDtos: CartDto[],
               @Auth() auth: UserDto, @Res({ passthrough: true }) res: Response) {
    let cartDto = this.cartService.findByDish(dishId, cartDtos);
    if (!cartDto)
      throw new NotFoundException(`Cart dto with dish id "${dishId}" doesn't exist!`);
    cartDtos = this.cartService.removeByDish(dishId, cartDtos ?? []);
    res.cookie("cart", JSON.stringify(cartDtos), {
      httpOnly: true,
      secure: true,
      domain: (new URL(this.configService.get("FRONTEND_URL"))).hostname
    });
  }
}
