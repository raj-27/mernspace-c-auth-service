"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
        });
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.perPageSanitize =
    exports.currentPageSanitize =
    exports.qSanitize =
    exports.createTenant =
    exports.isJWT =
    exports.truncateTable =
        void 0;
const truncateTable = (connection) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const entities = connection.entityMetadatas;
        for (const entity of entities) {
            const repository = connection.getRepository(entity.name);
            yield repository.clear();
        }
    });
exports.truncateTable = truncateTable;
const isJWT = (token) => {
    if (!token) {
        return false;
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }
    try {
        parts.forEach((part) => {
            Buffer.from(part, "base64").toString("utf-8");
        });
        return true;
    } catch (error) {
        return false;
    }
};
exports.isJWT = isJWT;
const createTenant = (respository) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const tenant = yield respository.save({
            name: "Test tenant",
            address: "Test Address",
        });
        return tenant;
    });
exports.createTenant = createTenant;
const qSanitize = () => {
    return {
        trim: true,
        customSanitizer: {
            options: (value) => {
                return value ? value : "";
            },
        },
    };
};
exports.qSanitize = qSanitize;
const currentPageSanitize = () => {
    return {
        customSanitizer: {
            options: (value) => {
                const parsedValue = Number(value);
                return Number.isNaN(parsedValue) ? 1 : parsedValue;
            },
        },
    };
};
exports.currentPageSanitize = currentPageSanitize;
const perPageSanitize = () => {
    return {
        customSanitizer: {
            options: (value) => {
                const parsedValue = Number(value);
                return Number.isNaN(parsedValue) ? 5 : parsedValue;
            },
        },
    };
};
exports.perPageSanitize = perPageSanitize;
