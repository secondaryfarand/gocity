import { Router } from "express";

import { crimeController } from '../features/crime/crime.controller.js'; 

const crimeRouter = Router();


crimeRouter.get('/', crimeController.getCrimes);

export default crimeRouter;