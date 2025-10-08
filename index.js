require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
 for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (!command.data || !command.data.name) {
    console.error(`⚠️ O arquivo ${file} está faltando o "data.name"!`);
    continue;
  }
  client.commands.set(command.data.name, command);
}
 client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`✅ Logado como ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error('Erro na interação:', err);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: '⚠️ Ocorreu um erro ao executar este comando.', ephemeral: true });
    } else {
      await interaction.reply({ content: '⚠️ Ocorreu um erro ao executar este comando.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
