import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.post("/", userController.create);
router.get("/", userController.findAll);
router.get("/:id", userController.findById);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;
