import { LoginForm } from "../../features/LoginForm";
import { Header } from "../../layout/Header";

export function LoginPage() {
  return (
    <div className="login-page">
      <Header />
      <LoginForm />
    </div>
  )
}