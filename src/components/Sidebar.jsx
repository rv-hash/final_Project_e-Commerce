import { Badge } from 'react-bootstrap'

export default function Sidebar({ open, menu, page, onNavigate, user, badges = {} }) {
  return (
    <aside className={`sidebar ${open ? '' : 'collapsed'}`} id="sidebar">
      <div className="store-name">KainKleek</div>
      <div className="px-3 pb-3 small text-center sidebar-user">
        {user.name}
        <Badge bg={user.role === 'seller' ? 'warning' : 'info'} text="dark" className="ms-2">
          {user.role === 'seller' ? 'Seller' : 'Customer'}
        </Badge>
      </div>
      <nav aria-label="Main menu">
        {menu.map((group) => (
          <div className="menu-group" key={group.title}>
            <p className="group-title">{group.title}</p>
            {group.items.map(([key, label]) => (
              <a key={key} href="#" className={page === key ? 'active' : ''}
                aria-current={page === key ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); onNavigate(key) }}>
                {label}
                {badges[key] > 0 && <Badge bg="light" text="dark" className="ms-2">{badges[key]}</Badge>}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
