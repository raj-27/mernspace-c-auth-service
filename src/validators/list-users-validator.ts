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
        role: {
            customSanitizer: {
                options: (value: string) => {
                    return value ? value : "";
                },
            },
        },
    },
    ["query"],
);
