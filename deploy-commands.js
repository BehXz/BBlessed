// ==========================
// deploy-commands.js
// ==========================
require('dotenv').config();
const { REST, Routes } = require('discord.js');

// ==========================
// 🔧 Definição dos comandos
// ==========================
const commands = [
  {
    name: 'relatorio',
    description: '📊 Gera um relatório de vendas registradas (padrão: últimos 7 dias)',
    options: [
      {
        name: 'dias',
        type: 4, // INTEGER
        description: 'Número de dias no período (padrão: 7)',
        required: false
      }
    ]
  },
  {
    name: 'setup',
    description: '⚙️ Cria o painel com o botão "Registrar Venda" neste canal (somente gerência)'
  },
  {
    name: 'setup-financeiro',
    description: '💰 Cria o painel com o botão "Registrar Dinheiro" neste canal (somente gerência)'
  }
];

// ==========================
// ⚙️ Configuração REST
// ==========================
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// ==========================
// 🚀 Registro dos comandos
// ==========================
(async () => {
  try {
    // Verificação básica do .env
    if (!process.env.CLIENT_ID || !process.env.GUILD_ID || !process.env.DISCORD_TOKEN) {
      throw new Error(
        '❌ Erro: Certifique-se de que CLIENT_ID, GUILD_ID e DISCORD_TOKEN estão definidos no arquivo .env'
      );
    }

    console.log('📦 Iniciando registro dos comandos de barra...');
    console.log(`🧩 Servidor ID: ${process.env.GUILD_ID}`);
    console.log(`🤖 Bot ID: ${process.env.CLIENT_ID}`);

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log('✅ Comandos registrados com sucesso no servidor!');
  } catch (err) {
    console.error('❌ Falha ao registrar comandos:');
    console.error(err);
  }
})();
