import { checkSchema } from "express-validator";
import {
    currentPageSanitize,
    perPageSanitize,
    qSanitize,
} from "../../tests/utils";

export default checkSchema(
    {
        q: qSanitize(),
        currentPage: currentPageSanitize(),
        perPage: perPageSanitize(),
    },
    ["query"],
);
