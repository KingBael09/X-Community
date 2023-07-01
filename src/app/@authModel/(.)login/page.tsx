import SignIn from "@/common/auth"
import InterceptModal from "@/common/intercept-modal"

export default function Page() {
  return (
    <InterceptModal>
      <SignIn name="login" />
    </InterceptModal>
  )
}
