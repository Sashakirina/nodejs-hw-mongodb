import { Router } from "express";
import * as contactsControllers from "../controllers/contacts.js";
import { ctrlWrapper } from "../utilits/ctrlWrapper.js";
import { isValidId } from "../midellwares/isValidId .js";

const router = Router();

router.get("/", ctrlWrapper(contactsControllers.getContactsController));

router.get(
	"/:contactId",
	isValidId,
	ctrlWrapper(contactsControllers.getContactByIdController)
);

router.post("/", ctrlWrapper(contactsControllers.createContactController));

router.patch(
	"/:contactId",
	isValidId,
	ctrlWrapper(contactsControllers.patchContactController)
);

router.delete(
	"/:contactId",
	isValidId,
	ctrlWrapper(contactsControllers.deleteContactController)
);

export default router;
