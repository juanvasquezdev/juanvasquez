"use client";

import { useState } from "react";

/** Una fila de la tabla, ya formateada en el servidor en el idioma de la ruta. */
export type TrackRow = {
  key: string;
  year: number;
  date: string; // "05 JUL 2026"
  competition: string;
  venue: string;
  place: string; // "1°"
  podium: boolean; // puesto 1-3: la etiqueta se resalta
  mark: string; // "2,05 m"
  pb: boolean; // la marca personal oficial va en coral
};

/** La mejor marca de un año, para la vista de barras. */
export type SeasonBest = {
  year: number;
  mark: string;
  competition: string;
  height: number; // % de la barra dentro de la escala
  pb: boolean;
};

type Labels = {
  eyebrow: string;
  heading: string;
  all: string;
  best: string;
  columns: { date: string; competition: string; place: string; mark: string };
};

type View = "all" | "best" | number;

/**
 * Lo único interactivo de Atleta: los filtros. Los datos llegan listos desde
 * components/Atleta.tsx (server), así que acá solo se decide qué se muestra.
 * El HTML del servidor trae la tabla completa ("Todos").
 */
export default function Trayectoria({
  labels,
  rows,
  seasons,
}: {
  labels: Labels;
  rows: TrackRow[];
  seasons: SeasonBest[];
}) {
  const [view, setView] = useState<View>("all");

  // Del más nuevo al más viejo, como vienen las filas.
  const years = [...new Set(rows.map((row) => row.year))];
  const filters: { id: View; label: string }[] = [
    { id: "all", label: labels.all },
    { id: "best", label: labels.best },
    ...years.map((year) => ({ id: year, label: String(year) })),
  ];

  const visible = typeof view === "number" ? rows.filter((row) => row.year === view) : rows;
  const groups = years
    .map((year) => ({ year, rows: visible.filter((row) => row.year === year) }))
    .filter((group) => group.rows.length > 0);

  return (
    <>
      <div className="traj-head">
        <div>
          <p className="mono eyebrow">{labels.eyebrow}</p>
          <h3 className="h2 traj-title">{labels.heading}</h3>
        </div>
        <div className="filters" role="group" aria-label={labels.heading}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={view === filter.id ? "fbtn on" : "fbtn"}
              aria-pressed={view === filter.id}
              onClick={() => setView(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {view === "best" ? (
        <div>
          {/* Las barras son el dibujo; el dato está escrito arriba y abajo de cada una. */}
          <div className="bars" style={{ "--cols": seasons.length } as React.CSSProperties}>
            {seasons.map((season) => (
              <div className="bar-col" key={season.year}>
                <span className="bar-v">{season.mark}</span>
                <div className="bar-area" aria-hidden="true">
                  <div
                    className={season.pb ? "sbar top" : "sbar"}
                    style={{ height: `${season.height}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="bar-meta mono" style={{ "--cols": seasons.length } as React.CSSProperties}>
            {seasons.map((season) => (
              <span key={season.year}>
                <b>{season.year}</b>
                {season.competition}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="results" role="table" aria-label={labels.heading}>
          <div role="rowgroup">
            <div className="rrow rhead" role="row">
              <span className="mono" role="columnheader">
                {labels.columns.date}
              </span>
              <span className="mono" role="columnheader">
                {labels.columns.competition}
              </span>
              <span className="mono" role="columnheader">
                {labels.columns.place}
              </span>
              <span className="mono" role="columnheader">
                {labels.columns.mark}
              </span>
            </div>
          </div>
          {groups.map((group) => (
            <div role="rowgroup" key={group.year}>
              <div className="ryear mono" role="row">
                <span role="cell">{group.year}</span>
              </div>
              {group.rows.map((row) => (
                <div className="rrow" role="row" key={row.key}>
                  <span className="mono rdate" role="cell">
                    {row.date}
                  </span>
                  <span role="cell">
                    <span className="comp">{row.competition}</span>
                    <span className="ven">{row.venue}</span>
                  </span>
                  <span role="cell">
                    <span className={row.podium ? "medal g" : "medal"}>{row.place}</span>
                  </span>
                  <span role="cell">
                    <span className={row.pb ? "mk pb" : "mk"}>{row.mark}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
