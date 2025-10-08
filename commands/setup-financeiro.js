const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-financeiro')
    .setDescription('Cria o botão "Registrar Dinheiro" neste canal (só staff)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  
  async execute(interaction) {
    const button = new ButtonBuilder()
      .setCustomId('registrar_dinheiro')
      .setLabel('💸 Registrar Dinheiro')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ content: '✅ Painel financeiro criado!', ephemeral: true });
    await interaction.channel.send({ content: '**🏦・Registro Financeiro**', components: [row] });
  },
};
