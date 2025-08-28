const fs = require("fs");
const path = require("path");

const AGENDA_FILE = path.join(__dirname, "../data/agenda.json");

function loadAgenda() {
  try {
    const data = fs.readFileSync(AGENDA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveAgenda(agenda) {
  fs.writeFileSync(AGENDA_FILE, JSON.stringify(agenda, null, 2));
}

module.exports = { loadAgenda, saveAgenda };
