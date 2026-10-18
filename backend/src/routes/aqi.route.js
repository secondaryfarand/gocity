import { Router } from 'express';
import { aqiController } from '../features/aqi/aqi.controller.js';

const aqiRouter = Router();

aqiRouter.get('/', aqiController.getAllAqi);

export default aqiRouter;