import { guildService as firebaseGuildService } from '../db/firebase-db.js';

class GuildService {
    async getSettings(guildId) {
        const guild = await firebaseGuildService.get(guildId);
        if (!guild) {
            // Create default settings
            await firebaseGuildService.create(guildId, {
                settings: JSON.stringify({
                    welcome_channel_id: null,
                    leave_channel_id: null,
                    log_channel_id: null,
                    game_source_channel_id: null,
                    request_channel_id: null,
                    news_channel_id: null,
                    general_chat_channel_id: null,
                    welcome_message: 'Selamat datang {user} di {server}!',
                    auto_role_id: null,
                    admin_allowed_roles: null
                })
            });
            return {
                guild_id: guildId,
                welcome_channel_id: null,
                leave_channel_id: null,
                log_channel_id: null,
                game_source_channel_id: null,
                request_channel_id: null,
                news_channel_id: null,
                general_chat_channel_id: null,
                welcome_message: 'Selamat datang {user} di {server}!',
                auto_role_id: null,
                admin_allowed_roles: null
            };
        }

        // Parse settings from JSON string
        let parsedSettings = {};
        try {
            parsedSettings = JSON.parse(guild.settings || '{}');
        } catch (e) {
            parsedSettings = {};
        }

        return {
            guild_id: guildId,
            ...parsedSettings
        };
    }

    async updateSetting(guildId, key, value) {
        const currentSettings = await this.getSettings(guildId);
        currentSettings[key] = value;

        // Remove guild_id from settings before saving
        const { guild_id, ...settingsToSave } = currentSettings;

        return await firebaseGuildService.updateSettings(guildId, settingsToSave);
    }

    // --- ACCESS CONTROL ---

    getAdminRoles(guildId) {
        const settings = this.getSettings(guildId);
        if (!settings.admin_allowed_roles) return [];
        try {
            return JSON.parse(settings.admin_allowed_roles);
        } catch (e) {
            return [];
        }
    }

    addAdminRole(guildId, roleId) {
        const roles = this.getAdminRoles(guildId);
        if (!roles.includes(roleId)) {
            roles.push(roleId);
            this.updateSetting(guildId, 'admin_allowed_roles', JSON.stringify(roles));
        }
        return roles;
    }

    removeAdminRole(guildId, roleId) {
        let roles = this.getAdminRoles(guildId);
        roles = roles.filter(id => id !== roleId);
        this.updateSetting(guildId, 'admin_allowed_roles', JSON.stringify(roles));
        return roles;
    }

    isAdmin(interaction) {
        // 1. Check Owner
        if (interaction.user.id === interaction.guild.ownerId) return true;

        // 2. Check Allowed Roles
        const allowedRoles = this.getAdminRoles(interaction.guild.id);
        if (allowedRoles.length > 0) {
            if (interaction.member.roles.cache.some(r => allowedRoles.includes(r.id))) {
                return true;
            }
        }

        // Return false (Default Admin permission don't automatically grant access to this dashboard
        // unless we want to allow Administrator permission by default? User said "hanya bisa di akses oleh yang owner tentukan")
        return false;
    }
}

export default new GuildService();
