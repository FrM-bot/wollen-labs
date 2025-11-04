'use client'
import { Button } from "@/components/ui/button"
import { Routes } from "@/lib/routes"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
export default function LoginButton() {
  const pathname = usePathname();
  const router = useRouter();
  
  const handleLogin = () => {
    router.push(Routes.api.auth.login(pathname));
  }

  return (
    <Button onClick={handleLogin} variant="outline">
      Login with Spotify
    </Button>
  )
}
