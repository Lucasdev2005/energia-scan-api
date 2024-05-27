import { Request } from "express";
import { TestService } from "../../service/teste.service";
import { TestController } from "./test.controller";

describe("TestController", () => {
    it("should return a response with the result of testeInjectable", async () => {
        // Arrange
        const mockTestService: TestService = {
            async testeInjectable() {
                return "Mocked test service working!";
            }
        };
        const testController = new TestController(mockTestService);
        const mockRequest = {} as Request;
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        // Act
        await testController.test(mockRequest, mockResponse as any);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith("Mocked test service working!");
    });
});
