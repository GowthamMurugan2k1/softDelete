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
exports.prismaClient = void 0;
const client_1 = require("@prisma/client");
exports.prismaClient = new client_1.PrismaClient().$extends({
    query: {
        $allModels: {
            findMany(_a) {
                return __awaiter(this, arguments, void 0, function* ({ model, args, query }) {
                    if (["Video", "Playlist", "CategoryVideo", "Category"].includes(model)) {
                        args.where = Object.assign(Object.assign({}, args.where), { deletedAt: null });
                    }
                    return query(args);
                });
            },
            findFirst(_a) {
                return __awaiter(this, arguments, void 0, function* ({ model, args, query }) {
                    if (["Video", "Playlist", "CategoryVideo", "Category"].includes(model)) {
                        args.where = Object.assign(Object.assign({}, args.where), { deletedAt: null });
                    }
                    return query(args);
                });
            }
        }
    }
});
