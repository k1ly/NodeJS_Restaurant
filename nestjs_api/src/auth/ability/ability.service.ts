import { Injectable } from "@nestjs/common";
import {
  AbilityBuilder, ExtractSubjectType, InferSubjects,
  MatchConditions, PureAbility, AbilityTuple
} from "@casl/ability";
import { AbilityAction } from "./ability.action";
import { UserDto } from "../../users/dto/user.dto";
import { RolesNames } from "../../roles/roles.names";
import { User } from "../../users/entities/user.entity";
import { Role } from "../../roles/entities/role.entity";
import { Address } from "../../addresses/entities/address.entity";
import { Order } from "../../orders/entities/order.entity";
import { Dish } from "../../dishes/entities/dish.entity";
import { Category } from "../../categories/entities/category.entity";
import { Status } from "../../statuses/entities/status.entity";
import { OrderItem } from "../../order-items/entities/order-item.entity";
import { Review } from "../../reviews/entities/review.entity";
import { CartDto } from "../../cart/dto/cart.dto";
import { CreateOrderItemDto } from "../../order-items/dto/create-order-item.dto";
import { CreateReviewDto } from "../../reviews/dto/create-review.dto";

type Subject = InferSubjects<typeof User | typeof Role | typeof Address |
  typeof Dish | typeof Category | typeof Order | typeof Status |
  typeof OrderItem | typeof CreateOrderItemDto | typeof CartDto |
  typeof Review | typeof CreateReviewDto, true> | "all";

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class AbilityService {
  authorize(auth: UserDto, action: AbilityAction, subject: Subject): boolean {
    const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);
    switch (auth.role) {
      case RolesNames.Admin:
        can(AbilityAction.Read, User);
        can(AbilityAction.Update, User);
        can(AbilityAction.Create, User, ({ id }) => id === auth.id);
        can(AbilityAction.Read, Role);
        can(AbilityAction.Read, Address);
        can(AbilityAction.Manage, Dish);
        can(AbilityAction.Manage, Category);
        can(AbilityAction.Read, Order);
        can(AbilityAction.Read, Status);
        can(AbilityAction.Read, OrderItem);
        can(AbilityAction.Update, OrderItem, ({ order }) => order.id === auth.order);
        can(AbilityAction.Create, CreateOrderItemDto, ({ order }) => order === auth.order);
        can(AbilityAction.Delete, OrderItem, ({ order }) => order.id === auth.order);
        can(AbilityAction.Read, Review);
        can(AbilityAction.Create, CreateReviewDto, ({ user }) => user === auth.id);
        break;
      case RolesNames.Manager:
        can(AbilityAction.Read, User);
        can(AbilityAction.Create, User, ({ id }) => id === auth.id);
        can(AbilityAction.Read, Role);
        can(AbilityAction.Read, Address);
        can(AbilityAction.Create, Address, ({ user }) => user.id === auth.id);
        can(AbilityAction.Read, Dish);
        can(AbilityAction.Read, Category);
        can(AbilityAction.Read, Order);
        can(AbilityAction.Update, Order);
        can(AbilityAction.Create, Order, ({ customer }) => customer.id === auth.id);
        can(AbilityAction.Delete, Order, ({ customer }) => customer.id === auth.id);
        can(AbilityAction.Read, Status);
        can(AbilityAction.Read, OrderItem);
        can(AbilityAction.Update, OrderItem, ({ order }) => order.id === auth.order);
        can(AbilityAction.Create, CreateOrderItemDto, ({ order }) => order === auth.order);
        can(AbilityAction.Delete, OrderItem, ({ order }) => order.id === auth.order);
        can(AbilityAction.Read, Review);
        can(AbilityAction.Create, CreateReviewDto, ({ user }) => user === auth.id);
        break;
      case RolesNames.Client:
        can(AbilityAction.Read, User);
        can(AbilityAction.Create, User, ({ id }) => id === auth.id);
        can(AbilityAction.Read, Role);
        can(AbilityAction.Read, Address);
        can(AbilityAction.Create, Address, ({ user }) => user.id === auth.id);
        can(AbilityAction.Read, Dish);
        can(AbilityAction.Read, Category);
        can(AbilityAction.Read, Order, ({ customer }) => customer.id === auth.id);
        can(AbilityAction.Create, Order, ({ customer }) => customer.id === auth.id);
        can(AbilityAction.Delete, Order, ({ customer }) => customer.id === auth.id);
        can(AbilityAction.Read, Status);
        can(AbilityAction.Read, OrderItem, ({ order }) => order.id === auth.order);
        can(AbilityAction.Update, OrderItem, ({ order }) => order.id === auth.order);
        can(AbilityAction.Create, CreateOrderItemDto, ({ order }) => order === auth.order);
        can(AbilityAction.Delete, OrderItem, ({ order }) => order.id === auth.order);
        can(AbilityAction.Read, Review);
        can(AbilityAction.Create, CreateReviewDto, ({ user }) => user === auth.id);
        break;
      case RolesNames.Guest:
        can(AbilityAction.Read, Role);
        can(AbilityAction.Read, Dish);
        can(AbilityAction.Read, Category);
        can(AbilityAction.Read, Status);
        can(AbilityAction.Read, Review);
        can(AbilityAction.Manage, CartDto);
        break;
    }
    let ability = build({
      conditionsMatcher: lambdaMatcher,
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subject>
    });
    return ability.can(action, subject);
  }
}