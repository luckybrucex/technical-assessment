import { Request, Response } from "express";
import { userController } from "../user.controller";
import { userService } from "../../services/user.service";

jest.mock("../../services/user.service");

const mockedService = jest.mocked(userService);

function mockReq(overrides: Partial<Request> = {}): Request {
  return { body: {}, params: {}, query: {}, ...overrides } as unknown as Request;
}

function mockRes(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

const fakeUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("userController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("create", () => {
    it("should return 400 when name is missing", async () => {
      const res = mockRes();
      await userController.create(mockReq({ body: { email: "a@b.com" } }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 when email is missing", async () => {
      const res = mockRes();
      await userController.create(mockReq({ body: { name: "Alice" } }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 201 with created user", async () => {
      mockedService.create.mockResolvedValue(fakeUser);
      const res = mockRes();
      await userController.create(
        mockReq({ body: { name: "Alice", email: "alice@example.com" } }),
        res
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeUser);
    });

    it("should return 409 on duplicate email (P2002)", async () => {
      const err: any = new Error("Unique constraint");
      err.code = "P2002";
      mockedService.create.mockRejectedValue(err);
      const res = mockRes();
      await userController.create(
        mockReq({ body: { name: "Alice", email: "alice@example.com" } }),
        res
      );
      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe("findAll", () => {
    it("should return list of users", async () => {
      mockedService.findAll.mockResolvedValue([fakeUser]);
      const res = mockRes();
      await userController.findAll(mockReq({ query: {} }), res);
      expect(res.json).toHaveBeenCalledWith([fakeUser]);
    });

    it("should pass query filters to service", async () => {
      mockedService.findAll.mockResolvedValue([]);
      const res = mockRes();
      await userController.findAll(mockReq({ query: { name: "Alice" } }), res);
      expect(mockedService.findAll).toHaveBeenCalledWith({ name: "Alice", email: undefined });
    });
  });

  describe("findById", () => {
    it("should return 400 for non-numeric id", async () => {
      const res = mockRes();
      await userController.findById(mockReq({ params: { id: "abc" } }) as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when user not found", async () => {
      mockedService.findById.mockResolvedValue(null);
      const res = mockRes();
      await userController.findById(mockReq({ params: { id: "999" } }) as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return user when found", async () => {
      mockedService.findById.mockResolvedValue(fakeUser);
      const res = mockRes();
      await userController.findById(mockReq({ params: { id: "1" } }) as any, res);
      expect(res.json).toHaveBeenCalledWith(fakeUser);
    });
  });

  describe("update", () => {
    it("should return 400 for non-numeric id", async () => {
      const res = mockRes();
      await userController.update(mockReq({ params: { id: "abc" } }) as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when user not found (P2025)", async () => {
      const err: any = new Error("Not found");
      err.code = "P2025";
      mockedService.update.mockRejectedValue(err);
      const res = mockRes();
      await userController.update(
        mockReq({ params: { id: "999" }, body: { name: "Bob" } }) as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return updated user", async () => {
      const updated = { ...fakeUser, name: "Bob" };
      mockedService.update.mockResolvedValue(updated);
      const res = mockRes();
      await userController.update(
        mockReq({ params: { id: "1" }, body: { name: "Bob" } }) as any,
        res
      );
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("should return 409 on duplicate email (P2002)", async () => {
      const err: any = new Error("Unique constraint");
      err.code = "P2002";
      mockedService.update.mockRejectedValue(err);
      const res = mockRes();
      await userController.update(
        mockReq({ params: { id: "1" }, body: { email: "taken@example.com" } }) as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe("delete", () => {
    it("should return 400 for non-numeric id", async () => {
      const res = mockRes();
      await userController.delete(mockReq({ params: { id: "abc" } }) as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 204 on success", async () => {
      mockedService.delete.mockResolvedValue(fakeUser);
      const res = mockRes();
      await userController.delete(mockReq({ params: { id: "1" } }) as any, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 when user not found (P2025)", async () => {
      const err: any = new Error("Not found");
      err.code = "P2025";
      mockedService.delete.mockRejectedValue(err);
      const res = mockRes();
      await userController.delete(mockReq({ params: { id: "999" } }) as any, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
