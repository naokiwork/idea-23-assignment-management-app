import { redirect } from 'next/navigation'

// ルートページはダッシュボードのホームページにリダイレクト
export default function RootPage() {
  redirect('/')
}

