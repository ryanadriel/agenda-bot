const { EmbedBuilder } = require("discord.js");

function buildEmbedAgenda(item) {
  const dateObj = new Date(item.datetime);
  const options = { weekday: "long", day: "2-digit", month: "2-digit" };
  const formattedDate = dateObj.toLocaleDateString("pt-BR", options);
  const formattedTime = dateObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let description = `🎮 Jogo: ${item.jogo}`;

  if (item.presences.length > 0) {
    const presencesList = item.presences
      .map((p) => `${p.username} (<@${p.id}>)`)
      .join("\n");
    description += `\n\n👥 Presenças confirmadas (${item.presences.length}):\n${presencesList}`;
  } else {
    description += "\n\n👥 Solo.";
  }

  return new EmbedBuilder()
    .setTitle(`🕒 ${formattedTime} - ${formattedDate}`)
    .setDescription(description)
    .setColor(0x0099ff);
}

module.exports = { buildEmbedAgenda };
