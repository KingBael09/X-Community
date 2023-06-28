import type { LayoutProps } from "@/types"

import CloseModal from "./close-modal"

export default function InterceptModal({ children }: LayoutProps) {
  return (
    <div className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto flex h-full max-w-lg items-center">
        <div className="relative h-fit w-full overflow-hidden rounded-lg bg-background px-2 py-20">
          <div className="absolute right-4 top-4">
            <CloseModal />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
