import type { LayoutProps } from "@/types"
import { Button } from "@/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog"
import { ScrollArea } from "@/ui/scroll-area"
import { Icons } from "@/util/icons"

export default function CommentModal({ children }: LayoutProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="my-3 w-full rounded-full px-4 text-muted-foreground"
        >
          <Icons.more />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[96vh] max-w-[95vw] overflow-hidden p-0 py-1 pr-1 md:max-w-2xl">
        <ScrollArea className="max-h-[94vh] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              More Comments
            </DialogTitle>
            <DialogDescription>{children}</DialogDescription>
          </DialogHeader>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
