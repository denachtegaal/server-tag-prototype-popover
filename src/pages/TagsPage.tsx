import { useState } from 'react'
import {
  ArrowLeftIcon,
  GlobeIcon,
  KebabIcon,
  SearchIcon,
  ServerIcon,
  SortIcon,
} from '../icons'
import { tagAssignmentCounts } from '../data'
import type { Store } from '../store'
import type { Route } from '../App'

interface Props {
  store: Store
  navigate: (r: Route) => void
  goBack: () => void
}

export function TagsPage({ store, navigate, goBack }: Props) {
  const [query, setQuery] = useState('')

  const tags = [...store.tags].sort((a, b) => b.added - a.added)
  const filtered = query
    ? tags.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    : tags

  return (
    <>
      <header className="page-header">
        <div className="page-header-top">
          <div className="left">
            <button className="back-btn" onClick={goBack} aria-label="Back">
              <ArrowLeftIcon />
            </button>
          </div>
        </div>
        <h1 className="page-title">Tags</h1>
      </header>

      <div className="toolbar">
        <div className="checkbox" />
        <div className="total">{filtered.length} total</div>
        <button className="sort-btn">
          <SortIcon width={14} height={14} /> Date added
        </button>
        <div className="filter-input">
          <SearchIcon width={14} height={14} />
          <input
            placeholder="Filter"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <ul className="row-list">
        {filtered.map((tag) => {
          const counts = tagAssignmentCounts(store.servers, tag.id)
          const totalAssigned = counts.server + counts.website
          return (
            <li
              key={tag.id}
              className="list-row"
              onClick={() => navigate({ name: 'tag-details', id: tag.id })}
            >
              <div className="checkbox" onClick={(e) => e.stopPropagation()} />
              <div className="name">{tag.name}</div>
              <div className="meta">
                {totalAssigned === 0 && <span className="meta-unassigned">Unassigned</span>}
                {counts.website > 0 && (
                  <span className="meta-chip">
                    <GlobeIcon width={14} height={14} /> {counts.website}
                  </span>
                )}
                {counts.server > 0 && (
                  <span className="meta-chip">
                    <ServerIcon width={14} height={14} /> {counts.server}
                  </span>
                )}
              </div>
              <div className="row-actions-cell" onClick={(e) => e.stopPropagation()}>
                <button className="kebab" aria-label="Row actions"><KebabIcon /></button>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
