import { prisma } from "@/lib/server/prisma";
import { DeepPartial } from "@/types";
import { Administrator } from "@prisma/client";

export async function CreateAdminAccount(data: Administrator) {
    return await prisma.administrator.create({
        data: {
            ssn: data.ssn,
            username: data.username,
            email: data.email,
            password: data.password,
        },
    });
}

export async function FindAdminAccount(ssn: string) {
    return await prisma.administrator.findUnique({
        where: {
            ssn: ssn,
        },
    });
}

export async function UpdateAdminAccount(
    ssn: string,
    data: DeepPartial<Administrator>
) {
    return await prisma.administrator.update({
        where: { ssn },
        data: {
            username: data.username,
            email: data.email,
        },
    });
}

export async function DeleteAdminAccount(ssn: string) {
    return await prisma.administrator.delete({
        where: {
            ssn: ssn,
        },
    });
}
