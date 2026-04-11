import Parser from 'rss-parser';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase.js';
import guildService from './guild.service.js';

const parser = new Parser();

// RSS Feeds Source
const FEEDS = [
    { url: 'https://store.steampowered.com/feeds/news.xml', name: 'Steam News', color: 0x1b2838, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png' },
    { url: 'https://www.reddit.com/r/CrackWatch/new/.rss', name: 'CrackWatch', color: 0xFF4500, icon: 'https://www.redditinc.com/assets/images/site/reddit-logo.png' }
];

export async function checkAndPostNews(client) {
    console.log('[NEWS] Checking for updates...');

    // Ambil semua guild yang punya news_channel_id
    const guilds = client.guilds.cache.map(g => g.id);

    for (const source of FEEDS) {
        try {
            const feed = await parser.parseURL(source.url);
            // Ambil 3 berita terbaru aja biar gak spam
            const items = feed.items.slice(0, 3).reverse();

            for (const item of items) {
                // Cek apakah sudah pernah dipost (Global check biar hemat DB)
                const newsRef = doc(db, 'news_history', item.guid || item.link);
                const exists = await getDoc(newsRef);

                if (!exists.exists()) {
                    // Simpan ke DB
                    await setDoc(newsRef, { posted_at: new Date() });

                    // Broadcast ke semua guild yang aktifkan fitur news
                    for (const guildId of guilds) {
                        const settings = guildService.getSettings(guildId);
                        if (settings && settings.news_channel_id) {
                            try {
                                const channel = await client.channels.fetch(settings.news_channel_id);
                                if (channel) {
                                    // Buat Embed Berita
                                    const embed = {
                                        author: { name: source.name, icon_url: source.icon },
                                        title: item.title,
                                        url: item.link,
                                        description: item.contentSnippet ? item.contentSnippet.substring(0, 300) + '...' : 'Klik link untuk baca selengkapnya.',
                                        color: source.color,
                                        footer: { text: `Posted: ${new Date(item.pubDate).toLocaleString()}` },
                                        timestamp: new Date()
                                    };

                                    await channel.send({ embeds: [embed] });
                                }
                            } catch (err) {
                                console.error(`[NEWS ERROR] Guild ${guildId}: ${err.message}`);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`[NEWS ERROR] Fetching ${source.name}: ${error.message}`);
        }
    }
}
