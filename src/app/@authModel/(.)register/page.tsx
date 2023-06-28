import SignUp from "@/components/common/auth"
import InterceptModal from "@/components/common/intercept-modal"

export default function Page() {
  return (
    <InterceptModal>
      <SignUp name="register" />
    </InterceptModal>
  )
}
