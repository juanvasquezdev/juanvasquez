"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

export default function SobreMi() {
  const [broken, setBroken] = useState(false);

  return (
    <section className="section" id="sobre-mi">
      <Reveal as="p" className="eyebrow">
        01 — Quién soy
      </Reveal>
      <Reveal as="h2" index={1}>
        Sobre Mí
      </Reveal>

      <div className="sobre-mi-grid">
        {!broken && (
          <Reveal className="sobre-mi-photo" index={2}>
            <Image
              src="/images/foto_posando2.jpeg"
              alt="Juan José Vásquez Giraldo"
              fill
              sizes="(max-width: 700px) 280px, 300px"
              onError={() => setBroken(true)}
            />
          </Reveal>
        )}

        <Reveal className="card card-wide" index={3}>
          <p>
            Soy Juan José Vásquez Giraldo, atleta colombiano especializado en salto alto. Con una marca
            personal de 2.06 metros, he demostrado ser un competidor de alto nivel a nivel nacional. He sido
            campeón nacional U18 en dos ocasiones y tengo una trayectoria destacada en competencias de élite.
            Mi dedicación, disciplina y pasión por el deporte me impulsan a seguir mejorando y alcanzando
            nuevas metas en mi carrera atlética — con la mirada puesta en la élite mundial.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
