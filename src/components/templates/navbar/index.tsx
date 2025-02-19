import Image from "next/image"
import Link from "next/link"
import Button from "@/components/molecules/button/Button"

export const Navbar = () => {
    return (
        <nav className="w-full flex items-center justify-between font-jakarta font-medium text-sm">
            <Image src="/images/logo/logo.png" alt="logo" width={230} height={100} />
            <ul className="flex items-center justify-between gap-x-8">
                <Link href="/" className="text-primary-500">Beranda</Link>
                <Link href="/" className="text-primary-500">Produk</Link>
                <Link href="/" className="text-primary-500">Galeri</Link>
                <div className="h-4 border-l border-primary-500"></div>
                <Button size="sm" variant="outline">Register</Button>
                <Button size="sm">Log In</Button>
            </ul>
        </nav>
    )
}