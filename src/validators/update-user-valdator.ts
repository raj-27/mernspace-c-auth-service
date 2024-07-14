import { checkSchema } from "express-validator";
import { UpdateUserRequest } from "../types";

export default checkSchema({
    firstName: {
        trim: true,
        notEmpty: true,
        errorMessage: "firstName is required",
    },
    lastName: {
        trim: true,
        notEmpty: true,
        errorMessage: "lastName is required",
    },
    email: {
        trim: true,
        notEmpty: true,
        errorMessage: "Email is required",
    },
    role: {
        notEmpty: true,
        errorMessage: "Role is Required",
    },
    tenantId: {
        errorMessage: "Tenant id is required",
        custom: {
            options: async (value, { req }) => {
                const role = (req.body as UpdateUserRequest).body.role;
                if (role === "admin") {
                    return false;
                } else {
                    return !!value;
                }
            },
        },
    },
});
