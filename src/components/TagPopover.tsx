import { useEffect, useRef, useState } from 'react'
import { CheckIcon, PencilIcon, PlusIcon } from '../icons'
import type { Store } from '../store'

interface Props {
  store: Store
  serverId: string
  onClose: () => void
}

type Mode =
  | { kind: 'list' }
  | { kind: 'new' }
  | { kind: 'rename'; tagId: string }

export function TagPopover({ store, serverId, onClose }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<Mode>({ kind: 'list' })

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!popoverRef.current) return
      if (popoverRef.current.contains(e.target as Node)) return
      onClose()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const server = store.servers.find((s) => s.id === serverId)
  if (!server) return null

  const lowerQuery = query.trim().toLowerCase()
  const filtered = lowerQuery
    ? store.tags.filter((t) => t.name.toLowerCase().includes(lowerQuery))
    : store.tags

  function toggle(tagId: string) {
    if (!server) return
    if (server.tagIds.includes(tagId)) {
      store.removeTagFromServer(server.id, tagId)
    } else {
      store.addTagToServer(server.id, tagId)
    }
  }

  if (mode.kind === 'new') {
    return (
      <div className="popover" ref={popoverRef}>
        <NewTagForm
          existingNames={store.tags.map((t) => t.name)}
          onCancel={() => setMode({ kind: 'list' })}
          onCreate={(name) => {
            const tag = store.createTag(name)
            store.addTagToServer(server.id, tag.id)
            setMode({ kind: 'list' })
            setQuery('')
          }}
        />
      </div>
    )
  }

  return (
    <div className="popover" ref={popoverRef}>
      <div className="search-row">
        <input
          type="text"
          placeholder="Search tags"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>
      <ul className="tag-list">
        {filtered.length === 0 && (
          <li className="empty">No tags found</li>
        )}
        {filtered.map((tag) => {
          const selected = server.tagIds.includes(tag.id)
          if (mode.kind === 'rename' && mode.tagId === tag.id) {
            return (
              <li key={tag.id}>
                <RenameRow
                  initial={tag.name}
                  store={store}
                  tagId={tag.id}
                  onDone={() => setMode({ kind: 'list' })}
                />
              </li>
            )
          }
          return (
            <li key={tag.id}>
              <div
                className={`popover-row ${selected ? 'selected' : ''}`}
                onClick={() => toggle(tag.id)}
                role="button"
              >
                <span className="row-name">{tag.name}</span>
                <button
                  className="pen"
                  aria-label={`Rename ${tag.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setMode({ kind: 'rename', tagId: tag.id })
                  }}
                >
                  <PencilIcon width={14} height={14} />
                </button>
                <span className="check" aria-hidden={!selected}>
                  {selected && <CheckIcon width={14} height={14} />}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="popover-footer">
        <button className="new-tag" onClick={() => setMode({ kind: 'new' })}>
          <PlusIcon width={16} height={16} />
          New tag
        </button>
      </div>
    </div>
  )
}

function NewTagForm({
  existingNames,
  onCancel,
  onCreate,
}: {
  existingNames: string[]
  onCancel: () => void
  onCreate: (name: string) => void
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const trimmed = value.trim()
  const disabled = trimmed.length === 0

  function submit() {
    if (disabled) return
    const dup = existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())
    if (dup) {
      setError('Tag already exists')
      return
    }
    onCreate(trimmed)
  }

  return (
    <div className="popover-form">
      <div className="form-title">Add new tag</div>
      <div className="input-wrap">
        <input
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') onCancel()
          }}
        />
        {error && <div className="error">{error}</div>}
      </div>
      <div className="actions">
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn primary" disabled={disabled} onClick={submit}>Create</button>
      </div>
    </div>
  )
}

function RenameRow({
  initial,
  store,
  tagId,
  onDone,
}: {
  initial: string
  store: Store
  tagId: string
  onDone: () => void
}) {
  const [value, setValue] = useState(initial)
  const [error, setError] = useState<string | null>(null)

  const trimmed = value.trim()
  const disabled = trimmed.length === 0 || trimmed === initial

  function submit() {
    if (trimmed.length === 0) return
    if (trimmed === initial) {
      onDone()
      return
    }
    const result = store.renameTag(tagId, trimmed)
    if (!result.ok) {
      if (result.reason === 'duplicate') setError('Tag already exists')
      return
    }
    onDone()
  }

  return (
    <div className="popover-row renaming" onClick={(e) => e.stopPropagation()}>
      <div className="popover-form" style={{ padding: 0 }}>
        <div className="input-wrap">
          <input
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
              if (e.key === 'Escape') onDone()
            }}
          />
          {error && <div className="error">{error}</div>}
        </div>
        <div className="actions">
          <button className="btn" onClick={onDone}>Cancel</button>
          <button className="btn primary" disabled={disabled} onClick={submit}>Save</button>
        </div>
      </div>
    </div>
  )
}
