import Link from "next/link";

export default async function Home() {

    return (
        <>
        <Link href="/account/create">Create Account</Link> <br/>
        <Link href="/login">Login</Link> <br/>
        <Link href="/account">My account</Link>
        </>
    );
}
