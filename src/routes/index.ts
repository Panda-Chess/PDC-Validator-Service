import { Router } from "express";
import AnalyseRoute from "./validate.route";

const router = Router();

router.use("/validate", AnalyseRoute);

export default router;