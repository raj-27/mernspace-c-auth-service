import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
    res.status(201).json({});
});

export default router;
