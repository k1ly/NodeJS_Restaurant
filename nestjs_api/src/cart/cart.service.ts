import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { Pageable } from "../util/pagination/pagination.pageable";
import { CartDto } from "./dto/cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { DishesService } from "../dishes/dishes.service";

@Injectable()
export class CartService {
  constructor(private readonly dishesService: DishesService) {
  }

  findAll(pageable: Pageable, cartDtos: CartDto[]): [CartDto[], number] {
    return [cartDtos.sort((a, b) => a[pageable.sort] === b[pageable.sort] ?
      0 : (a[pageable.sort] < b[pageable.sort] ? (pageable.order === "asc" ? -1 : 1) : (pageable.order === "asc" ? 1 : -1)))
      .slice(pageable.page * pageable.size).slice(0, pageable.size), cartDtos.length];
  }

  findByDish(dishId: number, cartDtos: CartDto[]): CartDto {
    return cartDtos.find(cartDto => cartDto.dish === dishId);
  }

  async create(createCartDto: CreateCartDto, cartDtos: CartDto[]): Promise<CartDto[]> {
    let cartDto = cartDtos.find(cartDto => cartDto.dish === createCartDto.dish);
    if (cartDto) {
      let updateCartDto = new UpdateCartDto();
      updateCartDto.quantity = cartDto.quantity + createCartDto.quantity;
      cartDtos = this.updateByDish(createCartDto.dish, updateCartDto, cartDtos);
    } else {
      if (!await this.dishesService.findById(createCartDto.dish))
        throw new BadRequestException(`Dish with id "${createCartDto.dish}" doesn't exist!`);
      cartDto = new CartDto();
      cartDto.quantity = createCartDto.quantity;
      cartDto.dish = createCartDto.dish;
      cartDtos.push(cartDto);
    }
    return cartDtos;
  }

  updateByDish(dishId: number, updateCartDto: UpdateCartDto, cartDtos: CartDto[]): CartDto[] {
    let cartDto = cartDtos.find(cartDto => cartDto.dish === dishId);
    cartDto.quantity = updateCartDto.quantity;
    return cartDtos;
  }

  removeByDish(dishId: number, cartDtos: CartDto[]): CartDto[] {
    cartDtos.splice(cartDtos.findIndex(cartDto => cartDto.dish === dishId), 1);
    return cartDtos;
  }
}
