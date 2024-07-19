import Link from "next/link"
import MobileMenu from "./MobileMenu"
import Image from "next/image"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs"


const Navbar = () => {
  return (
    <div className="h-24 flex items-center justify-between">
        {/* LEft */}
        <div className="md:hidden lg:block w-[20%]">
            <Link href="/" className="font-bold text-xl text-blue-600"> REAL SOCIAL</Link>
        </div>
        {/* CENTER */}
        <div className="hidden md:flex w-[50%] text-sm">
          <div className="flex gap-6 text-gray-600">
            {/* Links */}
            <Link href="/" className="flex  items-center gap-2">
            <Image src="/home.png" alt = "home" width={16} height={16} className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link href="/" className="flex  items-center gap-2">
            <Image src="/friends.png" alt = "home" width={16} height={16} className="w-4 h-4"/>
              <span>Friends</span>
            </Link>
            <Link href="/" className="flex items-center  gap-2">
            <Image src="/stories.png" alt = "home" width={16} height={16} className="w-4 h-4"/>
              <span>Stories</span>
            </Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-[30%] flex items-center gap-4  xl:gap-8 justify-end">
            <ClerkLoading>
              <div className="inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] text-neutral-50 opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]" role="status"/>
            </ClerkLoading>
            <ClerkLoaded>
              <SignedIn>
                <div className="cursor-pointer">
                  <Image src= "/people.png" alt="" width={20} height={20} />
                </div>
                <div className="cursor-pointer">
                  <Image src= "/messages.png" alt="" width={20} height={20} />
                </div>
                <div className="cursor-pointer">
                  <Image src= "/notifications.png" alt="" width={20} height={20} />
                </div>
              </SignedIn>
              <SignedOut></SignedOut>
            </ClerkLoaded>
            <MobileMenu/>
        </div>
    </div>
  )
}

export default Navbar