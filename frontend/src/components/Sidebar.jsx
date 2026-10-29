import { MenuIcon, ListIcon, GearIcon } from './Icons.jsx';

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <button className="icon-btn sidebar__toggle" onClick={onToggle} aria-label="Alternar menu lateral">
        <MenuIcon />
      </button>

      <div className="profile">
        <div className="avatar" aria-hidden="true">JD</div>
        <div className="profile__text">
          <strong>Jane Doe</strong>
          <span>janedoe@gmail.com</span>
        </div>
      </div>

      <nav className="nav">
        <a className="nav__item is-active" href="#" onClick={(e) => e.preventDefault()}>
          <ListIcon /> <span>My Tasks</span>
        </a>
        <a className="nav__item" href="#" onClick={(e) => e.preventDefault()}>
          <GearIcon /> <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
}
