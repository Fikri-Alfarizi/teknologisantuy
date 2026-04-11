import { inventoryService } from '../db/firebase-db.js';

class InventoryService {
    /**
     * Add item to user inventory
     */
    async addItem(userId, itemId, expiresAt = null, metadata = null) {
        // For Firebase, we'll use itemId as the item_name
        const quantity = 1; // Default quantity
        return await inventoryService.addItem(userId, itemId, quantity);
    }

    /**
     * Get user inventory
     */
    async getUserInventory(userId) {
        return await inventoryService.get(userId);
    }

    /**
     * Check if user has item
     */
    async hasItem(userId, itemId) {
        const inventory = await this.getUserInventory(userId);
        return inventory.some(item => item.item_name === itemId);
    }

    /**
     * Use/consume item
     */
    async useItem(userId, itemId) {
        return await inventoryService.removeItem(userId, itemId, 1);
    }

    /**
     * Remove expired items (Firebase handles this automatically with TTL)
     */
    async cleanExpiredItems() {
        // Firebase handles expiration automatically
        return true;
    }
}

export default new InventoryService();
        const stmt = db.prepare(`
            DELETE FROM inventory 
            WHERE expires_at IS NOT NULL AND expires_at <= ?
        `);

        return stmt.run(now);
    }
}

export default new InventoryService();
