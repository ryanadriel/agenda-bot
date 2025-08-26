require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const AGENDA_FILE = path.join(__dirname, "agenda.json");

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

let agenda = loadAgenda();

client.once("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const guild = message.guild;

  if (message.content.startsWith("!live add")) {
    const args = message.content.split(" ").slice(2);
    const date = args[0];
    const time = args[1];
    const jogo = args.slice(2).join(" ");

    if (!date || !time || !jogo) {
      return message.reply(
        "❌ Uso correto: !live add <YYYY-MM-DD> <HH:MM> <Jogo>"
      );
    }

    const datetimeString = `${date}T${time}:00`;
    const datetime = new Date(datetimeString);

    if (isNaN(datetime)) {
      return message.reply("❌ Data ou hora inválida! Use YYYY-MM-DD HH:MM");
    }

    const id = datetime.getTime();
    agenda.push({ id, datetime: datetime.toISOString(), jogo, presences: [] });
    saveAgenda(agenda);

    return message.reply(
      `✅ Live adicionada!\n🎮 Jogo: ${jogo}\n🕒 Data e hora: ${datetime.toLocaleString(
        "pt-BR"
      )}`
    );
  }

  if (message.content.startsWith("!presence")) {
    const dia = message.content.split(" ")[1];

    if (!dia) return message.reply("Uso correto: !presence <YYYY-MM-DD>");

    const diaJogo = agenda.find((item) => item.datetime.startsWith(dia));

    if (!diaJogo) return message.reply("Dia não encontrado na agenda!");

    if (diaJogo.presences.some((p) => p.id === message.author.id)) {
      return message.reply("Você já marcou presença!");
    }

    diaJogo.presences.push({
      id: message.author.id,
      username: message.author.username,
    });
    saveAgenda(agenda);

    return message.reply(
      `✅ Presença adicionada em ${diaJogo.jogo} (${diaJogo.datetime})!`
    );
  }

  if (message.content === "!agenda") {
    if (agenda.length === 0) return message.reply("📅 Não há lives agendadas.");

    const embeds = generateEmbeds(agenda, guild);
    return message.reply({ embeds });
  }

  if (message.content.startsWith("!live remove")) {
  if (!message.member.permissions.has("ADMINISTRATOR")) {
    return message.reply("❌ Você não tem permissão para usar esse comando!");
  }

  if (agenda.length === 0) return message.reply("Nenhuma live encontrada!");

  const dia = message.content.slice("!live remove".length).trim();

  if (!dia) return message.reply("Uso correto: !live remove <YYYY-MM-DD>");

  const diaJogo = agenda.find((item) => item.datetime.startsWith(dia));

  if (!diaJogo) return message.reply("Dia não encontrado na agenda!");

  agenda = agenda.filter((item) => item.id !== diaJogo.id);
  saveAgenda(agenda);

  return message.reply(
    `✅ Live removida com sucesso! ${diaJogo.jogo} - ${new Date(
      diaJogo.datetime
    ).toLocaleString("pt-BR")}`
  );
}

  if (message.content.startsWith("!live clear")) {
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.reply("❌ Você não tem permissão para usar esse comando!");
    }

    if (agenda.length === 0) return message.reply("Nenhuma live encontrada!");

    agenda = [];
    saveAgenda(agenda);

    return message.reply("✅ Todas as lives foram removidas!");
  }
});

function generateEmbeds(agenda, guild) {
  const sortedAgenda = [...agenda].sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime)
  );

  return sortedAgenda.map((item) => {
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
  });
}

client.login(process.env.DISCORD_TOKEN);
