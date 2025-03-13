"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchAsyncHandler = exports.errorMiddleware = void 0;
const client_1 = require("@prisma/client");
const createError = (message, statusCode = 500) => ({
    message,
    statusCode,
});
const errorMiddleware = (err, req, res, next) => {
    var _a, _b;
    console.error(err);
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        ({ message, statusCode } = createError(`Validation Error: ${err.message}`, 400));
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                ({ message, statusCode } = createError(`${(_a = err.meta) === null || _a === void 0 ? void 0 : _a.target} already exists`, 400));
                break;
            case "P2003":
                ({ message, statusCode } = createError(`Foreign Key Constraint Error: ${(_b = err.meta) === null || _b === void 0 ? void 0 : _b.field_name}`, 400));
                break;
            case "P2025":
                ({ message, statusCode } = createError(`Record not found: ${err.message}`, 404));
                break;
            default:
                ({ message, statusCode } = createError(`Database Error: ${err.message}`, 500));
                break;
        }
    }
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorMiddleware = errorMiddleware;
const CatchAsyncHandler = (passedFunc) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield passedFunc(req, res, next);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.CatchAsyncHandler = CatchAsyncHandler;
