import {
  getCurrentUser,
  getCurrentUserDevices,
  type AccountDeviceSession,
} from "@/lib/core/auth"
import { Monitor, Smartphone, Laptop, ShieldCheck } from "lucide-react"
import { notFound, redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui"

type PageProps = {
  params: Promise<{
    username: string
  }>
}

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function renderDeviceIcon(deviceName: string) {
  const normalizedName = deviceName.toLowerCase()

  if (
    normalizedName.includes("iphone") ||
    normalizedName.includes("android") ||
    normalizedName.includes("phone") ||
    normalizedName.includes("pixel")
  ) {
    return <Smartphone className="size-4" />
  }

  if (
    normalizedName.includes("macbook") ||
    normalizedName.includes("laptop") ||
    normalizedName.includes("notebook")
  ) {
    return <Laptop className="size-4" />
  }

  return <Monitor className="size-4" />
}

function DeviceRow({
  session,
}: {
  session: AccountDeviceSession
}) {
  return (
    <TableRow>
      <TableCell className="w-10">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          {renderDeviceIcon(session.device)}
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex min-w-0 flex-col">
          <span className="font-medium">
            {session.device}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatDateTime(session.createdAt)}
            {session.location != "unknown" ?  " • " + session.location : ""}
          </span>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default async function UserDevicesPage({ params }: PageProps) {
  const { username } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login")
  }

  if (currentUser.data.username !== username) {
    notFound()
  }

  const devices = await getCurrentUserDevices()

  if (!devices) {
    redirect("/auth/login")
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Устройства</CardTitle>
          <CardDescription>
            Здесь можно посмотреть, где активны ваши сеансы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-5">
            <div className="mb-3 text-muted-foreground uppercase">
              Это устройство
            </div>

            {devices.current ? (
              <Table>
                <TableBody>
                  <DeviceRow session={devices.current} />
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                API не вернул информацию о текущем устройстве.
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 text-muted-foreground uppercase">
              Активные сеансы
            </div>

            {devices.active.length > 0 ? (
              <Table>
                <TableBody>
                  {devices.active.map((session) => (
                    <DeviceRow key={session.familyId} session={session} />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                  <ShieldCheck className="size-4" />
                  Других активных устройств нет
                </div>
                Сейчас активен только текущий сеанс.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
