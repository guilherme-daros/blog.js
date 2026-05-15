import { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login — Terminal Admin",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="login-body">
      <LoginForm />
    </div>
  );
}
