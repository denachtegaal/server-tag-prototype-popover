import { useState } from 'react'
import {
  ArrowLeftIcon,
  CloseIcon,
  GlobeIcon,
  KebabIcon,
  SearchIcon,
  ServerIcon,
  SortIcon,
  TagIcon,
} from '../icons'
import type { Store } from '../store'
import type { Route } from '../App'

interface Props {
  tagId: string
  store: Store
  navigate: (r: Route) => void
  goBack: () => void
}

interface ToastState {
  serverId: string
  serverName: string
}

export function TagDetailsPage({ tagId, store, navigate, goBack }: Props) {
  const [query, setQuery] = useState('')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)

  const tag = store.tags.find((t) => t.id === tagId)
  if (!tag) {
    return (
      <div style={{ padding: 24 }}>
        Tag not found. <button className="btn" onClick={() => navigate({ name: 'tags' })}>Back to Tags</button>
      </div>
    )
  }

  const assigned = store.servers.filter((s) => s.tagIds.includes(tag.id))
  const filtered = query
    ? assigned.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : assigned

  function unassign(serverId: string, serverName: string) {
    store.removeTagFromServer(serverId, tag!.id)
    setOpenMenu(null)
    setToast({ serverId, serverName })
  }

  function undo() {
    if (!toast) return
    store.addTagToServer(toast.serverId, tag!.id)
    setToast(null)
  }

  return (
    <>
      <header className="page-header">
        <div className="page-header-top">
          <div className="left">
            <button className="back-btn" onClick={goBack} aria-label="Back">
              <ArrowLeftIcon />
            </button>
            <span className="breadcrumb">
              <span className="crumb" onClick={() => navigate({ name: 'tags' })}>
                Tags
              </span>{' '}
              /
            </span>
          </div>
          <div className="page-header-actions">
            <button className="btn">Rename</button>
            <button className="icon-btn-ghost"><KebabIcon /></button>
          </div>
        </div>
        <h1 className="page-title">
          <TagIcon width={20} height={20} className="title-icon" />
          {tag.name}
        </h1>
      </header>

      <div className="toolbar">
        <div className="checkbox" />
        <div className="total">{filtered.length} total</div>
        <button className="sort-btn">
          <SortIcon width={14} height={14} /> Date added
        </button>
        <div className="filter-input">
          <SearchIcon width={14} height={14} />
          <input placeholder="Filter" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <ul className="row-list">
        {filtered.map((server) => (
          <li
            key={server.id}
            className="list-row"
            onClick={() => navigate({ name: 'server', id: server.id })}
          >
            <div className="checkbox" onClick={(e) => e.stopPropagation()} />
            <div className="name">
              {server.kind === 'website'
                ? <GlobeIcon width={16} height={16} />
                : <ServerIcon width={16} height={16} />}
              {server.name}
            </div>
            <div />
            <div className="row-actions-cell" onClick={(e) => e.stopPropagation()}>
              <button
                className="kebab"
                onClick={() => setOpenMenu(openMenu === server.id ? null : server.id)}
                aria-label="Row actions"
              >
                <KebabIcon />
              </button>
              {openMenu === server.id && (
                <RowMenu
                  onUnassign={() => unassign(server.id, server.name)}
                  onClose={() => setOpenMenu(null)}
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      {toast && (
        <div className="toast">
          <span>Tag unassigned from {toast.serverName}</span>
          <button className="undo" onClick={undo}>Undo</button>
          <button className="close" onClick={() => setToast(null)} aria-label="Close">
            <CloseIcon width={14} height={14} />
          </button>
        </div>
      )}
    </>
  )
}

function RowMenu({ onUnassign, onClose }: { onUnassign: () => void; onClose: () => void }) {
  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 10 }}
        onClick={onClose}
      />
      <div className="menu">
        <button onClick={onUnassign}>Unassign</button>
      </div>
    </>
  )
}
