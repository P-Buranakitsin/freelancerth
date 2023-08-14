import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";


describe('prisma', () => {
    it('should return an instance of PrismaClient', () => {
        expect(prisma).toBeInstanceOf(PrismaClient);
    });
});