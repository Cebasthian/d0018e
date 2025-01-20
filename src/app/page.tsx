import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {

    const admins = await prisma.admin.findMany({});
    console.log(admins)

    return (
        <>
        <Link href={"/test"}>Test</Link>
        <pre>
            {JSON.stringify(admins, null, 4)}
        </pre>
        </>
    );
}
