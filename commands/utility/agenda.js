const { SlashCommandBuilder } = require("discord.js");
const { loadAgenda } = require("../../services/agendaService");
const { buildEmbedAgenda } = require("../../utils/embedBuilder");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("agenda")
  .setDescription("Replies with agenda!"),

  async execute(interaction) {
    const agenda = loadAgenda();

    if (agenda.length === 0) return interaction.reply("📅 Nenhuma live agendada.");

    const sortedAgenda = [...agenda].sort(
      (a, b) => new Date(a.datetime) - new Date(b.datetime)
    );

    const embeds = sortedAgenda.map(buildEmbedAgenda);
    return interaction.reply({ embeds });
  }
}