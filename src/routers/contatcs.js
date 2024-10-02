import { Router } from "express";
import * as contactsControllers from "../controllers/contacts.js";
import { ctrlWrapper } from "../utilits/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId .js";
import { validateBody } from "../utilits/validateBody.js";
import {
	contactAddSchema,
	contactUpdateSchema,
} from "../validation/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.use(authenticate);

router.get("/", ctrlWrapper(contactsControllers.getContactsController));

router.get(
	"/:contactId",
	isValidId,
	ctrlWrapper(contactsControllers.getContactByIdController)
);

router.post(
	"/",
	upload.single("photo"),
	validateBody(contactAddSchema),
	ctrlWrapper(contactsControllers.createContactController)
);

router.patch(
	"/:contactId",
	isValidId,
	upload.single("photo"),
	validateBody(contactUpdateSchema),
	ctrlWrapper(contactsControllers.patchContactController)
);

router.delete(
	"/:contactId",
	isValidId,
	ctrlWrapper(contactsControllers.deleteContactController)
);

export default router;
