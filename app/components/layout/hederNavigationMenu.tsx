import Link from "next/link";
import { auth, signOut } from "@/auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const handlesignout = async () => {
  "use server";
  await signOut();
};

export default async function HeaderNavigationManu() {
  const session = await auth();

  return (
    <NavigationMenu className="">
      {session?.user ? (
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{session.user?.name}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="./profile">profile</NavigationMenuLink>

              {session.user?.userGroup === "Admin" && (
                <NavigationMenuLink href="./register">
                  new user
                </NavigationMenuLink>
              )}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <button onClick={handlesignout}>logout</button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      ) : (
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={"./login"}>login</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      )}
    </NavigationMenu>
  );
}
