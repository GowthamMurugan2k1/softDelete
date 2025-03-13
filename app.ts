import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { errorMiddleware } from "./middleware/errorMiddleware";
import router from "./routes";

const app = express();
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.urlencoded({ extended: true }));
//Error Middleware
app.use(errorMiddleware);

app.use(express.json());

const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// router 
app.use('/api/v1',router)

app.listen(PORT, () => {
  console.log(`server running successfully port ${PORT}`);
});
