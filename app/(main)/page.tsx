import { ExampleArticle } from "@/components/example-article"

export default function Page() {
  return (
    <div className="space-y-5">
      <article className="rounded-[1rem] bg-card px-6 py-8 shadow-sm ring-1 ring-foreground/10 sm:px-8 sm:py-10 kht-mb">
        <ExampleArticle />
      </article>
      {/*<div className="mt-5 font-mono text-xs text-muted-foreground">*/}
      {/*  (Press <kbd>«D»</kbd> to toggle dark mode)*/}
      {/*</div>*/}
    </div>
  )
}
