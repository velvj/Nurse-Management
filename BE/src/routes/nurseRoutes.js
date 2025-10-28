// routes/nurseRoutes.js
import express from 'express';
import { validateNurse, validateUpdateNurse } from "../middleware/validation/nurseValidation.js";

export const nurseRoutes = (controller) => {
  const router = express.Router();

  console.log("inside nurse routes");
  

  router.get('/getNurse', controller.getAll);
  router.get('/nurse/:id', controller.getById);
  router.post('/create', validateNurse(), controller.create);
  router.put('/update',validateUpdateNurse(), controller.update);
  router.delete('/nurseDelete/:id', controller.delete);

  return router;
};

export const NurseDownloadRoutes = (downloadController) => {
  const router = express.Router();
  router.get('/csv', downloadController.downloadCSV);
  router.get('/xlsx', downloadController.downloadXLSX);
  return router;
};
