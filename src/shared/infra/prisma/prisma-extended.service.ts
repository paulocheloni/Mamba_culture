import { Injectable } from "@nestjs/common";
import type { CustomPrismaClientFactory } from "nestjs-prisma";
import {
	type ExtendedPrismaClient,
	extendedPrismaClient,
} from "./prisma.extension";

@Injectable()
export class ExtendedPrismaConfigService
	implements CustomPrismaClientFactory<ExtendedPrismaClient>
{
	createPrismaClient(): ExtendedPrismaClient {
		return extendedPrismaClient;
	}
}

export const PrismaService = "PrismaService";
