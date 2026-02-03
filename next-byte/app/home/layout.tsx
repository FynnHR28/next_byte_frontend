"use client";

import { auth_request } from "@/api_client/api_request";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

const navRouteStyle = "text-stone-600 text-lg hover:underline hover:underline-offset-6 hover:text-stone-800";
const navActiveStyle = "text-stone-900 text-lg underline underline-offset-6";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current URL path (reacts to changes)
  const isActive = (href: string) => pathname === href; // Active if link href matches current url path
  const router = useRouter();
  const logout = async () => {
    await auth_request({
      query: `
          mutation logout {
            logout 
          }
          `
      })
    router.push('/auth/login')
  }

  return (
    <main className="min-h-screen bg-app-gradient">
      <div className="w-full h-20 bg-gray-50 shadow-lg sticky top-0 z-50 flex gap-10 items-center px-10">
        <Link
          href="/home"
          className={isActive("/home") ? navActiveStyle : navRouteStyle}
          style={{ fontFamily: "Georgia" }}
        >
          Home
        </Link>
        <Link
          href="/home/profile"
          className={isActive("/home/profile") ? navActiveStyle : navRouteStyle}
          style={{ fontFamily: "Georgia" }}
        >
          Profile
        </Link>
        <Link
          href="/home/recipes"
          className={isActive("/home/recipes") ? navActiveStyle : navRouteStyle}
          style={{ fontFamily: "Georgia" }}
        >
          Recipes
        </Link>
        <Link
          href="/home/restaurants"
          className={
            isActive("/home/restaurants") ? navActiveStyle : navRouteStyle
          }
          style={{ fontFamily: "Georgia" }}
        >
          Restaurants
        </Link>
        <Link
          href="/home/search"
          className={isActive("/home/search") ? navActiveStyle : navRouteStyle}
          style={{ fontFamily: "Georgia" }}
        >
          Search
        </Link>
        <div className="w-full flex justify-end">
            <button 
              className={`cursor-pointer ${navRouteStyle}`}  
              style={{ fontFamily: "Georgia" }}
              onClick={() => logout()}
            >
              Logout
            </button>
        </div>
        <Link 
          href="/settings"
          className={isActive("/settings") ? navActiveStyle : navRouteStyle}
        >
          <Settings/>
        </Link>
      </div>
      {children}
    </main>
  );
}
