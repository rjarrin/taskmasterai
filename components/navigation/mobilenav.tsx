import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import UserProfile from './userprofile'
import { primaryNavigationItems } from '@/utils'
import githubLogo from "@/public/github.svg";
import Image from "next/image";


export default function MobileNav({
  navTitle = "",
  navLink = "#",
} : {
  navTitle?: string;
  navLink?: string;
}) {
  // return (
  //   <div className="flex flex-col">
  //       <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
  //         <Sheet>
  //           <SheetTrigger asChild>
  //             <Button
  //               variant="outline"
  //               size="icon"
  //               className="shrink-0 md:hidden"
  //             >
  //               <Menu className="h-5 w-5" />
  //               <span className="sr-only">Toggle navigation menu</span>
  //             </Button>
  //           </SheetTrigger>
  //           <SheetContent side="left" className="flex flex-col">
  //             <nav className="grid gap-2 text-lg font-medium">
  //               <Link
  //                 href="#"
  //                 className="flex items-center gap-2 text-lg font-semibold"
  //               >
  //                 <Package2 className="h-6 w-6" />
  //                 <span className="sr-only">Acme Inc</span>
  //               </Link>
  //               <Link
  //                 href="#"
  //                 className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
  //               >
  //                 <Home className="h-5 w-5" />
  //                 Dashboard
  //               </Link>
  //               <Link
  //                 href="#"
  //                 className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
  //               >
  //                 <ShoppingCart className="h-5 w-5" />
  //                 Orders

  //               </Link>
  //               <Link
  //                 href="#"
  //                 className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
  //               >
  //                 <Package className="h-5 w-5" />
  //                 Products
  //               </Link>
  //               <Link
  //                 href="#"
  //                 className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
  //               >
  //                 <Users className="h-5 w-5" />
  //                 Customers
  //               </Link>
  //               <Link
  //                 href="#"
  //                 className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
  //               >
  //                 <LineChart className="h-5 w-5" />
  //                 Analytics
  //               </Link>
  //             </nav>
  //             <div className="mt-auto">
  //               <Card>
  //                 <CardHeader>
  //                   <CardTitle>Upgrade to Pro</CardTitle>
  //                   <CardDescription>
  //                     Unlock all features and get unlimited access to our
  //                     support team.
  //                   </CardDescription>
  //                 </CardHeader>
  //                 <CardContent>
  //                   <Button size="sm" className="w-full">
  //                     Upgrade
  //                   </Button>
  //                 </CardContent>
  //               </Card>
  //             </div>
  //           </SheetContent>
  //         </Sheet>
  //         <div className="w-full flex-1">
  //           <form>
  //             <div className="relative">
  //               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  //               <Input
  //                 type="search"
  //                 placeholder="Search products..."
  //                 className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
  //               />
  //             </div>
  //           </form>
  //         </div>
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="secondary" size="icon" className="rounded-full">
  //               <CircleUser className="h-5 w-5" />
  //               <span className="sr-only">Toggle user menu</span>
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>My Account</DropdownMenuLabel>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem>Settings</DropdownMenuItem>
  //             <DropdownMenuItem>Support</DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem>Logout</DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       </header>
  //       <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
  //         <div className="flex items-center">
  //           <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
  //         </div>
  //         <div
  //           className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
  //         >
  //           <div className="flex flex-col items-center gap-1 text-center">
  //             <h3 className="text-2xl font-bold tracking-tight">
  //               You have no products
  //             </h3>
  //             <p className="text-sm text-muted-foreground">
  //               You can start selling as soon as you add a product.
  //             </p>
  //             <Button className="mt-4">Add Product</Button>
  //           </div>
  //         </div>
  //       </main>
  //     </div>
  // )
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className='flex flex-col'>
          <nav className="grid gap-2 text-lg font-medium">
            <UserProfile />
            {primaryNavigationItems.map(({name, icon, link}, idx) => (
              <Link key={idx} href={link} className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground">
                {icon}
                {name}
              </Link>
            ))}
            <div className="flex items-center mt-6 mb-2">
              <p className="flex flex-1 text-base">My Projects</p>
            </div>
          </nav>
          <div className='mt-auto'>
          <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className='flex items-center md:justify-between w-full gap-1 md:gap-2 py-2'>
        <div className='lg:flex-1'>
          <Link href={navLink}>
            <p className='text-sm font-semibold text-foreground/70 w-24'>
              {navTitle}
            </p>
          </Link>
        </div>
        <div className="place-content-center w-12 h-12 lg:w-16 lg:h-20">
          <Image alt="github logo" src={githubLogo} />
        </div>
      </div>
    </header>
  );
}

