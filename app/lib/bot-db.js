import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  deleteDoc,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase.js';

// Firebase collections
const COLLECTIONS = {
  USERS: 'bot_users',
  GUILDS: 'bot_guilds',
  INVENTORY: 'bot_inventory',
  GAME_CACHE: 'bot_game_cache',
  MODERATION_LOGS: 'bot_moderation_logs',
  NOTIFICATIONS: 'bot_notifications',
  BOT_SETTINGS: 'bot_settings'
};

// Bot settings management
export const botSettings = {
  async get() {
    try {
      const docRef = doc(db, COLLECTIONS.BOT_SETTINGS, 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Create default settings
        const defaultSettings = {
          enabled: true,
          maintenance: false,
          lastUpdated: Timestamp.now(),
          version: '1.0.0'
        };
        await setDoc(docRef, defaultSettings);
        return defaultSettings;
      }
    } catch (error) {
      console.error('Error getting bot settings:', error);
      return { enabled: true, maintenance: false };
    }
  },

  async update(settings) {
    try {
      const docRef = doc(db, COLLECTIONS.BOT_SETTINGS, 'main');
      await updateDoc(docRef, {
        ...settings,
        lastUpdated: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating bot settings:', error);
      return false;
    }
  },

  async toggleEnabled() {
    try {
      const current = await this.get();
      return await this.update({ enabled: !current.enabled });
    } catch (error) {
      console.error('Error toggling bot enabled:', error);
      return false;
    }
  }
};

// User operations
export const userService = {
  async get(userId) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async create(userId, userData) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const data = {
        username: userData.username || 'Unknown',
        xp: 0,
        level: 1,
        coins: 100, // Starting coins
        last_daily: 0,
        last_weekly: 0,
        is_afk: false,
        afk_reason: null,
        afk_timestamp: 0,
        job: 'Pengangguran',
        daily_spins: 0,
        last_spin_time: 0,
        seasonal_xp: 0,
        reputation: 0,
        trust_score: 50,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        ...userData
      };

      await setDoc(docRef, data);
      return { id: userId, ...data };
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },

  async update(userId, updateData) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(docRef, {
        ...updateData,
        updated_at: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  async getOrCreate(userId, userData = {}) {
    let user = await this.get(userId);
    if (!user) {
      user = await this.create(userId, userData);
    }
    return user;
  },

  async getTopUsers(limitCount = 10) {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        orderBy('xp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting top users:', error);
      return [];
    }
  },

  async getTotalCoins() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      let total = 0;
      querySnapshot.forEach(doc => {
        const data = doc.data();
        total += data.coins || 0;
      });
      return total;
    } catch (error) {
      console.error('Error getting total coins:', error);
      return 0;
    }
  },

  async getUserCount() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting user count:', error);
      return 0;
    }
  }
};

// Guild operations
export const guildService = {
  async get(guildId) {
    try {
      const docRef = doc(db, COLLECTIONS.GUILDS, guildId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting guild:', error);
      return null;
    }
  },

  async create(guildId, guildData) {
    try {
      const docRef = doc(db, COLLECTIONS.GUILDS, guildId);
      const data = {
        name: guildData.name || 'Unknown Guild',
        settings: '{}',
        created_at: Timestamp.now(),
        ...guildData
      };

      await setDoc(docRef, data);
      return { id: guildId, ...data };
    } catch (error) {
      console.error('Error creating guild:', error);
      return null;
    }
  },

  async updateSettings(guildId, settings) {
    try {
      const docRef = doc(db, COLLECTIONS.GUILDS, guildId);
      await updateDoc(docRef, {
        settings: JSON.stringify(settings),
        updated_at: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating guild settings:', error);
      return false;
    }
  }
};

// Inventory operations
export const inventoryService = {
  async get(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.INVENTORY),
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting inventory:', error);
      return [];
    }
  },

  async addItem(userId, itemName, quantity = 1) {
    try {
      // Check if item already exists
      const q = query(
        collection(db, COLLECTIONS.INVENTORY),
        where('user_id', '==', userId),
        where('item_name', '==', itemName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update existing item
        const docRef = querySnapshot.docs[0].ref;
        const currentData = querySnapshot.docs[0].data();
        await updateDoc(docRef, {
          quantity: (currentData.quantity || 0) + quantity,
          acquired_at: Timestamp.now()
        });
      } else {
        // Create new item
        await addDoc(collection(db, COLLECTIONS.INVENTORY), {
          user_id: userId,
          item_name: itemName,
          quantity: quantity,
          acquired_at: Timestamp.now()
        });
      }
      return true;
    } catch (error) {
      console.error('Error adding item:', error);
      return false;
    }
  },

  async removeItem(userId, itemName, quantity = 1) {
    try {
      const q = query(
        collection(db, COLLECTIONS.INVENTORY),
        where('user_id', '==', userId),
        where('item_name', '==', itemName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const currentData = querySnapshot.docs[0].data();
        const newQuantity = (currentData.quantity || 0) - quantity;

        if (newQuantity <= 0) {
          await deleteDoc(docRef);
        } else {
          await updateDoc(docRef, { quantity: newQuantity });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  }
};

// Game cache operations
export const gameCacheService = {
  async get(guildId, channelId) {
    try {
      const docRef = doc(db, COLLECTIONS.GAME_CACHE, `${guildId}_${channelId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting game cache:', error);
      return null;
    }
  },

  async set(guildId, channelId, gameData) {
    try {
      const docRef = doc(db, COLLECTIONS.GAME_CACHE, `${guildId}_${channelId}`);
      await setDoc(docRef, {
        guild_id: guildId,
        channel_id: channelId,
        game_data: gameData,
        last_updated: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error setting game cache:', error);
      return false;
    }
  }
};

// Moderation logs
export const moderationService = {
  async addLog(logData) {
    try {
      await addDoc(collection(db, COLLECTIONS.MODERATION_LOGS), {
        ...logData,
        timestamp: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error adding moderation log:', error);
      return false;
    }
  }
};

// Notifications
export const notificationService = {
  async add(userId, type, message) {
    try {
      await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
        user_id: userId,
        type: type,
        message: message,
        read: false,
        created_at: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error adding notification:', error);
      return false;
    }
  },

  async get(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.NOTIFICATIONS),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }
};