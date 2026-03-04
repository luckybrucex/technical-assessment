import { Request, Response } from "express";
import { userService } from "../services/user.service";

type IdParams = { id: string };

export const userController = {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: "name and email are required" });
      return;
    }
    try {
      const user = await userService.create(name, email);
      res.status(201).json(user);
    } catch (err: any) {
      if (err.code === "P2002") {
        res.status(409).json({ error: "email already exists" });
        return;
      }
      throw err;
    }
  },

  async findAll(req: Request, res: Response) {
    const name = req.query.name as string | undefined;
    const email = req.query.email as string | undefined;
    const users = await userService.findAll({ name, email });
    res.json(users);
  },

  async findById(req: Request<IdParams>, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "invalid id" });
      return;
    }
    const user = await userService.findById(id);
    if (!user) {
      res.status(404).json({ error: "user not found" });
      return;
    }
    res.json(user);
  },

  async update(req: Request<IdParams>, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "invalid id" });
      return;
    }
    const { name, email } = req.body;
    try {
      const user = await userService.update(id, { name, email });
      res.json(user);
    } catch (err: any) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "user not found" });
        return;
      }
      if (err.code === "P2002") {
        res.status(409).json({ error: "email already exists" });
        return;
      }
      throw err;
    }
  },

  async delete(req: Request<IdParams>, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "invalid id" });
      return;
    }
    try {
      await userService.delete(id);
      res.status(204).send();
    } catch (err: any) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "user not found" });
        return;
      }
      throw err;
    }
  },
};
