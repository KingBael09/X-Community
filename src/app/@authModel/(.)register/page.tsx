import SignUp from "@/common/auth"
import InterceptModal from "@/common/intercept-modal"

export default function Page() {
  return (
    <InterceptModal>
      <SignUp name="register" />
    </InterceptModal>
  )
}
