import SignUp from "@/components/auth-form-template"
import { InterceptModal } from "@/components/intercept-modal/intercept-modal"

export const metadata = {
  title: "Sign In",
  description: "Sign into your account",
}

export default function Page() {
  return (
    <InterceptModal>
      <SignUp name="register" />
    </InterceptModal>
  )
}
