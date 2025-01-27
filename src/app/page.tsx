import Link from "next/link";

export default async function Home() {

    return (
        <>
        <Link href={"/test"}>Test</Link>
        <pre>
            {JSON.stringify({}, null, 4)}
        </pre>
        </>
    );
}
