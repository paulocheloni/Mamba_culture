import { PrismaClient } from "@prisma/client";
import extension from "prisma-paginate";

export const extendedPrismaClient = new PrismaClient().$extends(extension);

export type ExtendedPrismaClient = typeof extendedPrismaClient;
