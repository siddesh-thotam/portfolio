"use client";

import React, { useCallback, useState } from "react";
import { Rnd } from "react-rnd";
import Clock from "./components/Clock";

/* ALL ICON TYPES */
type AppType =
  | "computer"
  | "documents"
  | "games"
  | "terminal"
  | "recycle"
  | "settings";

/* Icon definition */
type IconData = {
  id: AppType;
  x: number;
  y: number;
  img: string;
};

/* Window definition */
type Win = {
  id: string;
  title: string;
  app: AppType;
  minimized?: boolean;
};

/* ICON → IMAGE MAP */
const APP_ICONS: Record<AppType, string> = {
  computer: "/icons/computer.png",
  documents: "/icons/folder.png",
  games: "/icons/games.png",
  terminal: "/icons/terminal.png",
  recycle: "/icons/recycle.png",
  settings: "/icons/setting.png",
};

export default function DesktopPage() {
  /* ============================
        DEFAULT ICON POSITIONS
     ============================ */
  const DEFAULT_ICONS: IconData[] = [
    { id: "computer", x: 70, y: 50, img: APP_ICONS.computer },
    { id: "documents", x: 80, y: 200, img: APP_ICONS.documents },
    { id: "games", x: 80, y: 350, img: APP_ICONS.games },
    { id: "terminal", x: 80, y: 500, img: APP_ICONS.terminal },
    { id: "settings", x: 1425, y: 510, img: APP_ICONS.settings },
    { id: "recycle", x: 1425, y: 350, img: APP_ICONS.recycle }, // bottom right
  ];

  const [icons, setIcons] = useState<IconData[]>(DEFAULT_ICONS);

  /* ICON DRAG — NOT SAVED */
  const moveIcon = (id: AppType, x: number, y: number) => {
    setIcons((prev) =>
      prev.map((icon) => (icon.id === id ? { ...icon, x, y } : icon))
    );
  };

  /* ============================
       WINDOW MANAGEMENT
     ============================ */

  const [windows, setWindows] = useState<Win[]>([]);

  const openWindow = useCallback((title: string, app: AppType) => {
    setWindows((prev) => [
      ...prev,
      { id: String(Date.now()), title, app, minimized: false },
    ]);
  }, []);

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
  };

  const restoreWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: false } : w))
    );
  };

  /* ============================
             RENDER
     ============================ */

  return (
    <div className="desktop">
      {/* 🔹 DRAGGABLE ICONS */}
      <div className="icons">
        {icons.map((icon) => (
          <Rnd
            key={icon.id}
            default={{
              x: icon.x,
              y: icon.y,
              width: "auto",
              height: "auto",
            }}
            enableResizing={false}
            bounds="parent"
            onDragStop={(e, d) => moveIcon(icon.id, d.x, d.y)}
          >
            <div
              className={`icon icon-${icon.id}`}
              onDoubleClick={() =>
                openWindow(icon.id.toUpperCase(), icon.id)
              }
            >
              <img src={icon.img} />
            </div>
          </Rnd>
        ))}
      </div>

      {/* 🔹 WINDOWS */}
      {windows.map(
        (win) =>
          !win.minimized && (
            <Rnd
              key={win.id}
              default={{ x: 300, y: 180, width: 640, height: 420 }}
              bounds="window"
            >
              <div className="window">
                <div className="window-frame"></div>

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
                  <p>Window UI content goes here.</p>
                </div>
              </div>
            </Rnd>
          )
      )}

      {/* 🔹 TASKBAR */}
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
