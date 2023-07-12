import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import morgan from "morgan"; //morgan module tell us that which api has been hit while requesting.
import cors from "cors"
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import path from "path"
import {fileURLToPath} from "url";

//configure env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//database config
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,"./client/build")))


//routes
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoryRoutes);
app.use('/api/v1/products',productRoutes);

//rest api
app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});