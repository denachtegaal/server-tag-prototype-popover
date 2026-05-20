import { useCallback, useState } from 'react'
import { initialServers, initialTags, type Server, type Tag } from './data'

export interface Store {
  tags: Tag[]
  servers: Server[]
  createTag: (name: string) => Tag
  renameTag: (id: string, name: string) => { ok: true } | { ok: false; reason: 'duplicate' | 'empty' }
  addTagToServer: (serverId: string, tagId: string) => void
  removeTagFromServer: (serverId: string, tagId: string) => void
}

export function useStore(): Store {
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [servers, setServers] = useState<Server[]>(initialServers)

  const createTag = useCallback((name: string): Tag => {
    const tag: Tag = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      added: Date.now(),
    }
    setTags((prev) => [...prev, tag])
    return tag
  }, [])

  const renameTag = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return { ok: false, reason: 'empty' as const }
      const dup = tags.some((t) => t.id !== id && t.name.toLowerCase() === trimmed.toLowerCase())
      if (dup) return { ok: false, reason: 'duplicate' as const }
      setTags((prev) => prev.map((t) => (t.id === id ? { ...t, name: trimmed } : t)))
      return { ok: true as const }
    },
    [tags],
  )

  const addTagToServer = useCallback((serverId: string, tagId: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId && !s.tagIds.includes(tagId)
          ? { ...s, tagIds: [...s.tagIds, tagId] }
          : s,
      ),
    )
  }, [])

  const removeTagFromServer = useCallback((serverId: string, tagId: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId ? { ...s, tagIds: s.tagIds.filter((t) => t !== tagId) } : s,
      ),
    )
  }, [])

  return { tags, servers, createTag, renameTag, addTagToServer, removeTagFromServer }
}
