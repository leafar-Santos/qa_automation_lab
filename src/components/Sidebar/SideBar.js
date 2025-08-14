// src/components/Sidebar.js
import React from "react";
import "./Sidebar.css";

export default function Sidebar({ items, active, onNavigate }) {
  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onNavigate(id);
    }
  };

  return (
    <aside
      className="menu"
      id="sidebar-menu"
      data-testid="sidebar-menu"
      data-qa="sidebar-menu"
      aria-label="Navegação principal"
    >
      <div
        className="brand"
        id="sidebar-brand"
        data-testid="sidebar-brand"
        data-qa="sidebar-brand"
      >
        <div className="t1" id="brand-title" data-testid="brand-title">
          AUTO TESTE LAB
        </div>
      </div>

      <nav
        id="sidebar-nav"
        data-testid="sidebar-nav"
        data-qa="sidebar-nav"
        aria-label="Seções"
      >
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              data-testid={`nav-item-${item.id}`}
              data-qa={`nav-item-${item.id}`}
              className={`item ${isActive ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              aria-current={isActive ? "page" : undefined}
              title={item.nome}
              type="button"
            >
              {item.icon && <span className="item-icon">{item.icon}</span>}
              <span className="item-label">{item.nome}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
