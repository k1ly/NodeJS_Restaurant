import { LoggingInterceptor } from "./logging.interceptor";

describe("LoggerInterceptor", () => {
  it("should be defined", () => {
    expect(new LoggingInterceptor(null)).toBeDefined();
  });
});
