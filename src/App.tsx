import { useCallback, useState } from 'react'
import { Layout } from './Layout'
import { ServerDetailsPage } from './pages/ServerDetailsPage'
import { TagsPage } from './pages/TagsPage'
import { TagDetailsPage } from './pages/TagDetailsPage'
import { useStore } from './store'

export type Route =
  | { name: 'server'; id: string }
  | { name: 'tags' }
  | { name: 'tag-details'; id: string }

function App() {
  const store = useStore()
  const [history, setHistory] = useState<Route[]>([{ name: 'server', id: 's-api-core03' }])

  const route = history[history.length - 1]

  const navigate = useCallback((next: Route) => {
    setHistory((prev) => {
      const last = prev[prev.length - 1]
      if (sameRoute(last, next)) return prev
      return [...prev, next]
    })
  }, [])

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }, [])

  return (
    <Layout route={route} navigate={navigate}>
      {route.name === 'server' && (
        <ServerDetailsPage
          serverId={route.id}
          store={store}
          navigate={navigate}
          goBack={goBack}
        />
      )}
      {route.name === 'tags' && (
        <TagsPage store={store} navigate={navigate} goBack={goBack} />
      )}
      {route.name === 'tag-details' && (
        <TagDetailsPage
          tagId={route.id}
          store={store}
          navigate={navigate}
          goBack={goBack}
        />
      )}
    </Layout>
  )
}

function sameRoute(a: Route, b: Route): boolean {
  if (a.name !== b.name) return false
  if (a.name === 'tags' && b.name === 'tags') return true
  if (a.name === 'server' && b.name === 'server') return a.id === b.id
  if (a.name === 'tag-details' && b.name === 'tag-details') return a.id === b.id
  return false
}

export default App
