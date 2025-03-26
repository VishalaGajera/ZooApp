const express = require("express");
const adoptionController = require("../Controllers/AdoptionControllers");

const AdoptionRouter = express.Router();

AdoptionRouter.post("/add", adoptionController.createAdoption);
AdoptionRouter.get("/get", adoptionController.getAdoptions);
AdoptionRouter.delete("/delete/:id", adoptionController.deleteAdoption);

module.exports = AdoptionRouter;