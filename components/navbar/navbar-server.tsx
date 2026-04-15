import { Navbar } from "@/components/navbar/navbar"
import { getCurrentUser } from "@/lib/auth"

export async function NavbarServer() {
  const user = await getCurrentUser()

  return <Navbar user={user} />
}
