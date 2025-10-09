// ---- Fonte de dados (fácil de editar) ----
const preisliste = {
  "Hose": [
    { service: "Jeans kürzen", preis: 15 },
    { service: "Hose Baumwolle kürzen", preis: 10 },
    { service: "Hose mit Bund seitlich enger/weiter", preis: 10 },
    { service: "Hose seitlich enger mit Futter", preis: 20 },
    { service: "Hose beidseitig enger + Bund", preis: 20 },
    { service: "Hose Reissverschluss", preis: 15, ab: true },
    { service: "Löcher flicken ", preis: 15, simple: true },
    { service: "Taschen zunähen", preis: 10, ab: true }
  ],
  "Bluse": [
    { service: "Länge kürzen", preis: 12 },
    { service: "Ärmel kürzen einfach", preis: 10 },
    { service: "Ärmel kürzen mit Manschette", preis: 15 },
    { service: "Manschette kürzen und enger", preis: 15 },
    { service: "Schultern schmaler machen", preis: 22 },
    { service: "Seiten verengen", preis: 15 }
  ],
  "Jacke & Mantel": [
    { service: "Länge kürzen", preis: 20 },
    { service: "Ärmel kürzen", preis: 20 },
    { service: "Ärmel kürzen mit Aufschlag", preis: 20 },
    { service: "Schulter heben", preis: 20 },
    { service: "Seitennähte", preis: 15 },
    { service: "Reissverschluss einnähen", preis: 30, ab: true },
    { service: "Taschen zunähen", preis: 15, ab: true }
  ],
  "Kleid": [
    { service: "Länge kürzen", preis: 20 },
    { service: "Länge kürzen mit Futter", preis: 30, ab: true },
    { service: "Länge kürzen mit Falten", preis: 15 },
    { service: "Länge kürzen mit Plissee", preis: 20 },
    { service: "Seitennähte enger", preis: 20 },
    { service: "Ärmel kürzen einfach", preis: 15 },
    { service: "Ärmel kürzen mit Manschette", preis: 10 },
    { service: "Schulter heben", preis: 15 },
    { service: "Reissverschluss einnähen", preis: 30, ab: true }
  ],
  "Rock": [
    { service: "Länge kürzen", preis: 15 },
    { service: "Länge mit Falten kürzen", preis: 15 },
    { service: "Länge kürzen mit Plissee", preis: 20 }
  ],
  "Haushalt & Sonstiges": [
    { service: "Bettwäsche Reissverschluss 80/80 cm", preis: 20, ab: true },
    { service: "Bettwäsche Reissverschluss 135/200 cm", preis: 20, ab: true },
    { service: "Bademantel (Conserto simples)", preis: 12, simple: true },
    { service: "Nachthemd Länge kürzen", preis: 12 },
    { service: "Schlafanzug Hose Länge kürzen", preis: 12 },
    { service: "Vorhang Länge kürzen", preis: 12, ab: true }
  ]
};

// ---- Utilidades ----
const CHF = (v) => `Fr. ${v.toFixed(2)}`;
const calcPreis = (item) => {
  let p = item.preis;
  if (item.simple) p += 10; // +10 CHF para conserto simples
  return (item.ab ? "ab " : "") + CHF(p);
};

// ---- Renderização ----
function renderList(data){
  const root = document.getElementById("preisliste");
  root.innerHTML = "";

  Object.entries(data).forEach(([cat, items]) => {
    const section = document.createElement("section");

    const h2 = document.createElement("h2");
    h2.textContent = cat;
    section.appendChild(h2);

    const table = document.createElement("table");
    table.className = "table";

    table.innerHTML = `
      <thead>
        <tr>
          <th>Leistung</th>
          <th>Preis</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(i => `
          <tr>
            <td>${i.service}</td>
            <td>${calcPreis(i)}</td>
          </tr>
        `).join("")}
      </tbody>
    `;

    section.appendChild(table);
    root.appendChild(section);
  });
}

document.addEventListener("DOMContentLoaded", () => renderList(preisliste));

