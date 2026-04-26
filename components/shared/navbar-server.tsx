import { Navbar } from "@/components/shared/navbar"
import { getCurrentUser } from "@/lib/core/auth"

export async function NavbarServer() {
  const user = await getCurrentUser()

  return <Navbar user={user} />
}
