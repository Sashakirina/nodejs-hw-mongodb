import { Router } from "express";
import * as contactsControllers from "../controllers/contacts.js";
import { ctrlWrapper } from "../utilits/ctrlWrapper.js";

const router = Router();

router.get("/contacts", ctrlWrapper(contactsControllers.getContactsController));

router.get(
	"/contacts/:contactId",
	ctrlWrapper(contactsControllers.getContactByIdController)
);

router.post(
	"/contacts",
	ctrlWrapper(contactsControllers.createContactController)
);

export default router;
