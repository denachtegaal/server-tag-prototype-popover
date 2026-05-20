export type ServerKind = 'server' | 'website'

export interface Tag {
  id: string
  name: string
  /** date added, used as sort */
  added: number
}

export interface Server {
  id: string
  name: string
  kind: ServerKind
  /** ids of assigned tags (excluding the special "Issues" status pill) */
  tagIds: string[]
}

export const initialTags: Tag[] = [
  { id: 't-eu', name: 'eu', added: 1 },
  { id: 't-europe-west', name: 'europe-west', added: 2 },
  { id: 't-germany', name: 'germany', added: 3 },
  { id: 't-prod', name: 'prod', added: 4 },
  { id: 't-thomas-kienel', name: 'thomas-kienel', added: 5 },
  { id: 't-scholz-eu', name: 'scholz-eu', added: 6 },
  { id: 't-staging', name: 'staging', added: 7 },
  { id: 't-dev', name: 'dev', added: 8 },
  { id: 't-cdn', name: 'cdn', added: 9 },
  { id: 't-cache', name: 'cache', added: 10 },
  { id: 't-backup', name: 'backup', added: 11 },
  { id: 't-api', name: 'api', added: 12 },
  { id: 't-frontend', name: 'frontend', added: 13 },
]

export const initialServers: Server[] = [
  {
    id: 's-api-core03',
    name: 'api-core03.prod.cluster',
    kind: 'server',
    tagIds: ['t-europe-west', 't-thomas-kienel', 't-prod'],
  },
  {
    id: 's-thomas-kienel',
    name: 'thomas-kienel.de',
    kind: 'website',
    tagIds: ['t-europe-west', 't-thomas-kienel'],
  },
  {
    id: 's-cache-redis01',
    name: 'cache-redis01.eu-west.internal',
    kind: 'server',
    tagIds: ['t-europe-west', 't-cache'],
  },
  {
    id: 's-alexander-scholz',
    name: 'alexander-scholz.de',
    kind: 'website',
    tagIds: ['t-europe-west', 't-scholz-eu'],
  },
  {
    id: 's-backup-srv02',
    name: 'backup-srv02.datacenter.net',
    kind: 'server',
    tagIds: ['t-europe-west', 't-backup'],
  },
  {
    id: 's-mustermann',
    name: 'mustermann.de',
    kind: 'website',
    tagIds: ['t-europe-west'],
  },
  {
    id: 's-cdn-edge04',
    name: 'cdn-edge04.eu-west.network',
    kind: 'server',
    tagIds: ['t-cdn', 't-germany'],
  },
]

/** Counts a tag's assignments by server kind for the Tags page table */
export function tagAssignmentCounts(servers: Server[], tagId: string) {
  let server = 0
  let website = 0
  for (const s of servers) {
    if (!s.tagIds.includes(tagId)) continue
    if (s.kind === 'server') server++
    else website++
  }
  return { server, website }
}
