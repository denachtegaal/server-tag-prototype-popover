import { useState } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  KebabIcon,
  PlusIcon,
  ServerIcon,
  TagIcon,
  WarningIcon,
} from '../icons'
import { TagPopover } from '../components/TagPopover'
import type { Store } from '../store'
import type { Route } from '../App'

interface Props {
  serverId: string
  store: Store
  navigate: (r: Route) => void
  goBack: () => void
}

export function ServerDetailsPage({ serverId, store, navigate, goBack }: Props) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const server = store.servers.find((s) => s.id === serverId)
  if (!server) return <div style={{ padding: 24 }}>Server not found.</div>

  const tags = server.tagIds
    .map((id) => store.tags.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  const hasTags = tags.length > 0

  return (
    <>
      <header className="page-header">
        <div className="page-header-top">
          <div className="left">
            <button className="back-btn" onClick={goBack} aria-label="Back">
              <ArrowLeftIcon />
            </button>
          </div>
          <div className="page-header-actions">
            <button className="btn">Info</button>
            <button className="btn primary">Open in Plesk</button>
            <button className="icon-btn-ghost" aria-label="More"><KebabIcon /></button>
          </div>
        </div>
        <h1 className="page-title">
          <ServerIcon width={20} height={20} />
          {server.name}
        </h1>

        <div className="tag-pill-row">
          {/* Issues pill always shown per design */}
          <div style={{ marginRight: 6 }}>
            <span className="chip issues">Issues</span>
          </div>

          {/* Popover anchored to this row container so the position stays put
              whether we show "No tags" or chips + "+" */}
          <div className="popover-anchor">
            <div className="tag-row">
              {!hasTags && (
                <button
                  className="chip no-tags"
                  onClick={() => setPopoverOpen((v) => !v)}
                  aria-label="Manage tags"
                >
                  <TagIcon width={14} height={14} /> No tags
                </button>
              )}
              {hasTags && (
                <>
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      className="chip"
                      onClick={() => navigate({ name: 'tag-details', id: tag.id })}
                    >
                      {tag.name}
                    </button>
                  ))}
                  <button
                    className="add-tag-btn"
                    onClick={() => setPopoverOpen((v) => !v)}
                    aria-label="Add tag"
                  >
                    <PlusIcon width={14} height={14} />
                  </button>
                </>
              )}
            </div>

            {popoverOpen && (
              <TagPopover
                store={store}
                serverId={server.id}
                onClose={() => setPopoverOpen(false)}
              />
            )}
          </div>
        </div>
      </header>

      <div className="server-grid">
        <div className="server-card">
          <h4>Monitoring <ArrowRightIcon className="arrow" /></h4>
          <div className="issues">
            <WarningIcon width={22} height={22} /> Issues
          </div>
          <div className="mini-chips">
            <span className="mini-chip">CPU</span>
            <span className="mini-chip">+1</span>
          </div>
        </div>
        <div className="server-card">
          <h4>Processes <ArrowRightIcon className="arrow" /></h4>
        </div>
        <div className="server-card">
          <h4>
            Maintenance
            <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <PlusIcon width={16} height={16} className="arrow" />
              <ArrowRightIcon className="arrow" />
            </span>
          </h4>
          <div className="muted">No scheduled windows</div>
        </div>
        <div className="server-card">
          <h4>Clients <ArrowRightIcon className="arrow" /></h4>
          <div className="big">4</div>
        </div>
      </div>

      <div className="wp-row">
        <h4 style={{ margin: 0, marginBottom: 14 }}>
          WP Guardian <ArrowRightIcon className="arrow" />
        </h4>
        <div className="risk">
          4.2 <small>/10 risk</small>
        </div>
        <span className="meta-chip" style={{ background: '#ececf2' }}>Low risk</span>
      </div>
    </>
  )
}
