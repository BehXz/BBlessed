const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Cria o botão "Registrar Venda" neste canal (só staff)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  
  async execute(interaction) {
    const button = new ButtonBuilder()
      .setCustomId('registrar_venda')
      .setLabel('🧾 Registrar Venda')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ content: '✅ Painel de registro criado!', ephemeral: true });
    await interaction.channel.send({ content: '**💰・Registro de Vendas**', components: [row] });
  },
};
