import Link from 'next/link'
import { Container, Header } from '@/components'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container className="py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">ページが見つかりません</h2>
          <p className="text-gray-600 mb-8">
            お探しのページは存在しないか、移動または削除された可能性があります。
          </p>
          <Link href="/">
            <Button variant="primary">ホームに戻る</Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}

