import type { ReactNode } from 'react'
import {
  PlusIcon,
  SearchIcon,
  HomeIcon,
  GlobeIcon,
  ServerIcon,
  TagIcon,
  ChevronsRightIcon,
  BellIcon,
  UserPlusIcon,
  SettingsIcon,
  HelpIcon,
  CloseIcon,
  ChevronDownIcon,
} from './icons'
import type { Route } from './App'

interface Props {
  route: Route
  navigate: (r: Route) => void
  children: ReactNode
}

export function Layout({ route, navigate, children }: Props) {
  const onTagsPage =
    route.name === 'tags' || route.name === 'tag-details'

  return (
    <div className="app">
      <aside className="left-nav">
        <button className="plus-btn" aria-label="Create">
          <PlusIcon width={20} height={20} />
        </button>
        <button className="nav-item" aria-label="Search">
          <SearchIcon />
        </button>
        <button className="nav-item" aria-label="Home">
          <HomeIcon />
        </button>
        <button className="nav-item" aria-label="Websites">
          <GlobeIcon />
        </button>
        <button
          className={`nav-item ${route.name === 'server' ? 'active' : ''}`}
          aria-label="Servers"
          onClick={() => navigate({ name: 'server', id: 's-api-core03' })}
        >
          <ServerIcon />
        </button>
        <button
          className={`nav-item ${onTagsPage ? 'active' : ''}`}
          aria-label="Tags"
          onClick={() => navigate({ name: 'tags' })}
        >
          <TagIcon />
        </button>
        <div className="nav-spacer" />
        <button className="collapse" aria-label="Collapse navigation">
          <ChevronsRightIcon />
        </button>
      </aside>

      <main className="main-col">
        <div className="page">{children}</div>
      </main>

      <AlertsPanel />

      <aside className="right-col">
        <div className="avatar" />
        <button className="icon-btn"><BellIcon /></button>
        <button className="icon-btn"><UserPlusIcon /></button>
        <button className="icon-btn"><SettingsIcon /></button>
        <button className="icon-btn"><HelpIcon /></button>
        <div style={{ flex: 1 }} />
        <button className="icon-btn"><HelpIcon /></button>
      </aside>
    </div>
  )
}

function AlertsPanel() {
  return (
    <aside className="alerts-col">
      <div className="alerts-head">
        <h3>Alerts</h3>
        <div className="alerts-head-icons">
          <SettingsIcon />
          <CloseIcon />
        </div>
      </div>
      <div className="alerts-filter">
        <span className="pill">1 critical</span>
        <span className="dropdown-pill">This tag <ChevronDownIcon width={12} height={12} /></span>
      </div>
      <div className="alert">
        <span className="dot" />
        <div>
          <div className="title">CPU used percentage &gt;90%</div>
          <div className="sub">api-core03.prod.cluster</div>
        </div>
      </div>
      <div className="alert">
        <span className="dot" />
        <div>
          <div className="title">HTTP 503 service unavailable</div>
          <div className="sub">alexander-scholz.de</div>
        </div>
      </div>
      <div className="alert">
        <span className="badge">2</span>
        <div>
          <div className="title">Plesk installation failed</div>
          <div className="sub">12 Jan 2025</div>
          <div className="sub">api-core03.prod.cluster</div>
        </div>
      </div>
      <div className="alert">
        <span className="dot" />
        <div>
          <div className="title">Process count Apache2 &gt; 30</div>
          <div className="sub">cdn-edge04.eu-west.network</div>
        </div>
      </div>
      <div className="alert">
        <span className="dot" />
        <div>
          <div className="title">Memory usage Apache2 &gt; 75%</div>
          <div className="sub">backup-srv02.datacenter.net</div>
        </div>
      </div>
    </aside>
  )
}
