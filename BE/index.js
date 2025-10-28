import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import sequelize from './src/config/dbConfig.js';
import Nurse from './src/models/Nurse.js';
import NurseService from './src/services/NurseService.js';
import NurseController from './src/controllers/NurseController.js';
import { nurseRoutes, NurseDownloadRoutes } from './src/routes/nurseRoutes.js';
import NurseDownloadController from './src/controllers/NurseDownloadController.js';

const app= express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Dependency Injection
const nurseService = new NurseService(Nurse);
const nurseController = new NurseController(nurseService);
const nurseDownloadController = new NurseDownloadController(nurseService);
console.log("Nurse service and controller initialized");
app.use('/api/nurses',nurseRoutes(nurseController));
app.use('/api/nurses/download',NurseDownloadRoutes(nurseDownloadController))

const PORT = process.env.PORT || 5000;

sequelize.sync().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
