import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { app } from "./app";
import connectDB from "./db";

dotenv.config({
  path: './env'
})
const port = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  }).catch((error) => {
    console.log(`mongodb connection failed ${error}`)
  })


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

