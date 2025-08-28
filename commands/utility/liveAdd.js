const { SlashCommandBuilder } = require("discord.js");
const { addLive } = require("../../services/liveService");
const { parseDateTime } = require("../../utils/validation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("live-add")
    .setDescription("Adiciona uma live ao agendamento")
    .addStringOption((option) =>
      option
        .setName("data")
        .setDescription("Data da live no formato YYYY-MM-DD")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("hora")
        .setDescription("Hora da live no formato HH:MM")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("jogo")
        .setDescription("Nome do jogo")
        .setRequired(true)
    ),

    async execute(interaction) {
      const data = interaction.options.getString("data");
      const hora = interaction.options.getString("hora");
      const jogo = interaction.options.getString("jogo");

      const datetime = parseDateTime(data, hora);

      if (!datetime) return interaction.reply("❌ Data ou hora inválidas! Use YYYY-MM-DD HH:MM")

      const live = addLive({ datetime, jogo });

      return interaction.reply(
        `✅ Live adicionada!\n🎮 Jogo: ${jogo}\n🕒 Data e hora: ${live.datetime.toLocaleString(
          "pt-BR"
        )}`
      );
    },
}