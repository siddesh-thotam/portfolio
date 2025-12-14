"use client";

import React, { useCallback, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import Clock from "./components/Clock";

type AppType =
  | "computer"
  | "documents"
  | "games"
  | "terminal"
  | "recycle"
  | "settings";

type IconData = {
  id: AppType;
  x: number;
  y: number;
  img: string;
};

type Win = {
  id: string;
  title: string;
  app: AppType;
  minimized?: boolean;
};

const APP_ICONS: Record<AppType, string> = {
  computer: "/icons/computer.png",
  documents: "/icons/folder.png",
  games: "/icons/games.png",
  terminal: "/icons/terminal.png",
  recycle: "/icons/recycle.png",
  settings: "/icons/setting.png",
};

export default function DesktopPage() {
  /* ---------------------------------------
     ICON POSITIONS (DRAGGABLE + CLICKABLE)
  ---------------------------------------- */

  const [icons, setIcons] = useState<IconData[]>([
    { id: "computer", x: 60, y: 60, img: APP_ICONS.computer },
    { id: "documents", x: 60, y: 200, img: APP_ICONS.documents },
    { id: "games", x: 50, y: 350, img: APP_ICONS.games },
    { id: "terminal", x: 60, y: 500, img: APP_ICONS.terminal },

    // moved safely to the right
    { id: "settings", x: 1425, y: 60, img: APP_ICONS.settings },
    { id: "recycle", x: 1425, y: 200, img: APP_ICONS.recycle },
  ]);

  const dragTimeout = useRef<NodeJS.Timeout | null>(null);
  const dragActive = useRef(false);

  const moveIcon = (id: AppType, x: number, y: number) => {
    setIcons((prev) =>
      prev.map((icon) => (icon.id === id ? { ...icon, x, y } : icon))
    );
  };

  /* ---------------------------------------
     WINDOWS
  ---------------------------------------- */

  const [windows, setWindows] = useState<Win[]>([]);

  const openWindow = (title: string, app: AppType) => {
    setWindows((prev) => [
      ...prev,
      { id: String(Date.now()), title, app, minimized: false },
    ]);
  };

  const closeWindow = (id: string) =>
    setWindows((prev) => prev.filter((w) => w.id !== id));

  const minimizeWindow = (id: string) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );

  const restoreWindow = (id: string) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: false } : w))
    );

  /* ---------------------------------------
     RENDER
  ---------------------------------------- */

  return (
    <div className="desktop">
      {/* ==========================
          DESKTOP ICONS (DRAG + CLICK)
      =========================== */}
      <div className="icons">
        {icons.map((icon) => (
          <Rnd
            key={icon.id}
            default={{ x: icon.x, y: icon.y, width: "auto", height: "auto" }}
            bounds="parent"
            enableResizing={false}
            onDragStart={() => {
              dragActive.current = true;
            }}
            onDragStop={(e, d) => {
              moveIcon(icon.id, d.x, d.y);
              dragActive.current = false;
            }}
          >
            <div
              className={`icon icon-${icon.id}`}
              onMouseDown={() => {
                dragTimeout.current = setTimeout(() => {
                  dragActive.current = true;
                }, 180);
              }}
              onMouseUp={() => {
                if (dragTimeout.current) clearTimeout(dragTimeout.current);

                if (!dragActive.current) {
                  openWindow(icon.id.toUpperCase(), icon.id);
                }

                dragActive.current = false;
              }}
            >
              <img src={icon.img} />
            </div>
          </Rnd>
        ))}
      </div>

      {/* ==========================
          WINDOWS
      =========================== */}
      {windows.map(
        (win) =>
          !win.minimized && (
            <Rnd
              key={win.id}
              default={{ x: 240, y: 160, width: 720, height: 480 }}
              bounds="window"
            >
              <div className="window">
                <div className="window-frame" />

                <div className="window-controls">
                  <img
                    src="/custom/minimize.png"
                    onClick={() => minimizeWindow(win.id)}
                  />
                  <img
                    src="/custom/close.png"
                    onClick={() => closeWindow(win.id)}
                  />
                </div>

                <div className="window-content">
                  <h2>{win.title}</h2>
                  <p>Your content goes here…</p>
                </div>
              </div>
            </Rnd>
          )
      )}

      {/* ==========================
          TASKBAR
      =========================== */}
      <div className="taskbar">
        <div className="taskbar-icons">
          {windows.map((w) => (
            <img
              key={w.id}
              src={APP_ICONS[w.app]}
              onClick={() =>
                w.minimized ? restoreWindow(w.id) : minimizeWindow(w.id)
              }
            />
          ))}
        </div>

        <Clock />
      </div>
    </div>
  );
}
