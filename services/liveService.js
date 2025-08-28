const { loadAgenda, saveAgenda } = require("./agendaService");

function addLive({ datetime, jogo }) {
  const agenda = loadAgenda();
  const id = datetime.getTime();
  agenda.push({ id, datetime: datetime.toISOString(), jogo, presences: [] });
  saveAgenda(agenda);

  return { id, datetime, jogo};
}

module.exports = { addLive };