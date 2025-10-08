const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('relatorio')
    .setDescription('📊 Gera relatório de vendas com resumo e ranking')
    .addIntegerOption(option =>
      option.setName('dias')
        .setDescription('Número de dias (padrão 7)')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      // Defer imediato (sem ephemeral)
      await interaction.deferReply();

      const dias = interaction.options.getInteger('dias') || 7;
      const dbPath = path.join(__dirname, '../sales.db');
      const db = new Database(dbPath);

      const desde = Date.now() - dias * 24 * 60 * 60 * 1000;
      const rows = db.prepare(`SELECT * FROM sales WHERE timestamp >= ?`).all(desde);

      if (rows.length === 0) {
        return interaction.editReply('⚠️ Nenhuma venda registrada nesse período.');
      }

      const totalSemana = rows.reduce((acc, v) => acc + v.valor, 0);
      const totalGeral = db.prepare(`SELECT SUM(valor) AS total FROM sales`).get().total || 0;
      const qtdSemana = rows.length;
      const qtdGeral = db.prepare(`SELECT COUNT(*) AS total FROM sales`).get().total || 0;

      // Ranking semanal
      const ranking = {};
      for (const venda of rows) {
        ranking[venda.vendedor] = (ranking[venda.vendedor] || 0) + venda.valor;
      }

      const top = Object.entries(ranking)
        .sort((a, b) => b[1] - a[1])
        .map(([vendedor, total], i) => `**#${i + 1}** ${vendedor} — R$ ${total.toFixed(2)}`)
        .slice(0, 5)
        .join('\n');

      const embed = new EmbedBuilder()
        .setColor('#9b59b6')
        .setTitle('📊 Relatório de Vendas')
        .setDescription(`Período: **últimos ${dias} dias**`)
        .addFields(
          { name: '💰 Total da Semana', value: `R$ ${totalSemana.toFixed(2)}`, inline: true },
          { name: '🧾 Total Geral', value: `R$ ${totalGeral.toFixed(2)}`, inline: true },
          { name: '📦 Vendas Semana', value: `${qtdSemana}`, inline: true },
          { name: '🗂️ Vendas Totais', value: `${qtdGeral}`, inline: true },
          { name: '🏆 Ranking de Vendedores', value: top || 'Sem vendas registradas' }
        )
        .setTimestamp()
        .setFooter({ text: 'Relatório Financeiro Blessed Bot', iconURL: interaction.client.user.displayAvatarURL() });

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('Erro no comando /relatorio:', err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '⚠️ Ocorreu um erro ao gerar o relatório.',
          flags: 64 // = ephemeral
        });
      }
    }
  }
};
