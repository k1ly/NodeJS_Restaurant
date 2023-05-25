import { Test, TestingModule } from "@nestjs/testing";
import { DishesController } from "./dishes.controller";
import { DishesService } from "./dishes.service";

describe("DishesController", () => {
  let controller: DishesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DishesController],
      providers: [DishesService]
    }).compile();

    controller = module.get<DishesController>(DishesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
