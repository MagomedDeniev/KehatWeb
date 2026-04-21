import Link from "next/link"
import { Button } from "@/components/ui"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">Страница не найдена</h1>
        <p className="text-sm text-muted-foreground">
          Такой страницы не существует или она была перемещена.
        </p>
        <Button asChild>
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </div>
  )
}
