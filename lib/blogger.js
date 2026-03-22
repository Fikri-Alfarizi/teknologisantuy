/**
 * Utility function untuk fetch data dari Google Blogger API
 */

let BLOGGER_API_URL = 'https://www.googleapis.com/blogger/v3';
let BLOG_ID = process.env.NEXT_PUBLIC_BLOGGER_BLOG_ID;
let API_KEY = process.env.NEXT_PUBLIC_BLOGGER_API_KEY;
const MAX_POSTS = parseInt(process.env.NEXT_PUBLIC_BLOGGER_MAX_POSTS || '9', 10);

/**
 * Extract Blog ID dari berbagai format:
 * - "1099518994320554010" (langsung)
 * - "https://www.blogger.com/blog/posts/1099518994320554010" (URL)
 */
function extractBlogId(id) {
  if (!id) return null;
  
  // Jika sudah berupa nomor
  if (/^\d+$/.test(id)) {
    return id;
  }
  
  // Jika berupa URL, extract nomor dari akhir
  const match = id.match(/\/posts\/(\d+)/);
  if (match && match[1]) {
    return match[1];
  }
  
  return id; // Return apa adanya jika format tidak terdeteksi
}

// Extract Blog ID ke format yang benar
BLOG_ID = extractBlogId(BLOG_ID);

/**
 * Map kategori dari label Blogger ke icon FontAwesome
 */
const categoryIconMap = {
  'game pc': { cat: 'Game PC', icon: 'fa-gamepad' },
  'game android': { cat: 'Android', icon: 'fa-mobile-screen' },
  'tutorial': { cat: 'Tutorial', icon: 'fa-laptop' },
  'tips': { cat: 'Tips', icon: 'fa-bolt' },
  'emulator': { cat: 'Emulator', icon: 'fa-microchip' },
};

/**
 * Extract kategori dari label atau tentukan berdasarkan content
 */
const getCategory = (post) => {
  const labels = post.labels || [];
  for (const label of labels) {
    const normalized = label.toLowerCase();
    if (categoryIconMap[normalized]) {
      return categoryIconMap[normalized];
    }
  }
  
  // Default category
  return { cat: 'Artikel', icon: 'fa-newspaper' };
};

/**
 * Extract deskripsi dari content (ambil 150 karakter pertama)
 */
const getDescription = (post) => {
  let content = post.content || '';
  // Hapus HTML tags
  content = content.replace(/<[^>]*>/g, '');
  // Ambil 150 karakter pertama
  return content.substring(0, 150).trim() + (content.length > 150 ? '...' : '');
};

/**
 * Extract gambar dari post (dari media atau dari HTML content)
 */
const getImageUrl = (post) => {
  // Coba ambil dari media property
  if (post.media?.image?.[0]?.url) {
    return post.media.image[0].url;
  }
  
  // Fallback: cari tag <img> di dalam content
  if (post.content) {
    const imgMatch = post.content.match(/<img[^>]+src=["']([^"']+)["']/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  return null;
};

/**
 * Fetch artikel dari Blogger
 */
export async function fetchBloggerPosts() {
  if (!BLOG_ID || !API_KEY) {
    console.warn('⚠️ Blogger API credentials tidak dikonfigurasi. Gunakan data dummy.');
    console.warn('   Tambahkan ke .env.local:');
    console.warn('   - NEXT_PUBLIC_BLOGGER_BLOG_ID=your_blog_id');
    console.warn('   - NEXT_PUBLIC_BLOGGER_API_KEY=your_api_key');
    return getDummyPosts();
  }

  try {
    console.log('🔄 Fetching posts dari Blogger API...');
    console.log(`   Blog ID: ${BLOG_ID}`);
    console.log(`   API Key: ${API_KEY.substring(0, 20)}...`);

    const url = new URL(`${BLOGGER_API_URL}/blogs/${BLOG_ID}/posts`);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('maxResults', MAX_POSTS.toString());
    url.searchParams.append('fetchBodies', 'true');
    url.searchParams.append('orderBy', 'published');
    url.searchParams.append('fetchImages', 'true');

    console.log(`   URL: ${url.toString().replace(API_KEY, '[REDACTED]')}`);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache selama 1 jam
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://teknologisantuy.com'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      let errorMessage = `HTTP ${response.status}`;
      
      try {
        const parsed = JSON.parse(errorData);
        errorMessage = parsed.error?.message || errorMessage;
      } catch (e) {
        // error data bukan JSON, gunakan status text saja
      }

      console.error(`❌ Blogger API Error [${response.status}]: ${errorMessage}`);

      if (response.status === 403) {
        console.error('   Kemungkinan penyebab:');
        console.error('   1. Blogger API tidak di-enable di Google Cloud Console');
        console.error('   2. API Key tidak memiliki permission untuk Blogger API');
        console.error('   3. API Key memiliki IP/Referer restrictions');
        console.error('   Solusi: Buka https://console.cloud.google.com dan enable Blogger API');
      } else if (response.status === 404) {
        console.error('   Blog ID tidak valid atau blog adalah private');
        console.error('   Blog ID harus berupa nomor, bukan URL');
        console.error('   Contoh benar: 1099518994320554010');
      } else if (response.status === 400) {
        console.error('   Request tidak valid. Cek Blog ID dan API Key format');
      }

      throw new Error(`Blogger API error: ${errorMessage}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.warn('⚠️ Tidak ada posts di Blogger. Menggunakan data dummy.');
      return getDummyPosts();
    }

    console.log(`✅ Berhasil fetch ${data.items.length} posts dari Blogger`);

    // Transform data dari Blogger API ke format yang digunakan
    return data.items.map((post, index) => {
      const category = getCategory(post);
      return {
        id: post.id,
        cat: category.cat,
        icon: category.icon,
        title: post.title,
        desc: getDescription(post),
        url: post.url,
        published: new Date(post.published).toLocaleDateString('id-ID'),
        author: post.author?.displayName || 'Admin',
        thumb: `t${(index % 3) + 1}`, // Rotate antara t1, t2, t3
        image: getImageUrl(post),
      };
    });
  } catch (error) {
    console.error('❌ Error fetching Blogger posts:', error.message);
    console.error('   Gunakan data dummy sebagai fallback');
    return getDummyPosts();
  }
}

/**
 * Data dummy ketika API tidak tersedia atau belum dikonfigurasi
 */
export function getDummyPosts() {
  return [
    {
      id: '1',
      cat: 'Game PC',
      icon: 'fa-gamepad',
      title: 'Download GTA V PC Gratis',
      desc: 'Open world terbaik. Panduan instalasi lengkap, anti error, direct link.',
      thumb: 't1',
      url: '#',
    },
    {
      id: '2',
      cat: 'Tutorial',
      icon: 'fa-laptop',
      title: 'Cara Install Windows 11',
      desc: 'Panduan lengkap tanpa product key. Dengan atau tanpa TPM 2.0.',
      thumb: 't2',
      url: '#',
    },
    {
      id: '3',
      cat: 'Tips',
      icon: 'fa-bolt',
      title: '10 Cara Mempercepat PC Lemot',
      desc: 'Tips ampuh tanpa upgrade hardware. Ringan, praktis, terbukti.',
      thumb: 't3',
      url: '#',
    },
    {
      id: '4',
      cat: 'Android',
      icon: 'fa-mobile-screen',
      title: 'Game Android Offline Terbaik 2025',
      desc: 'Main tanpa internet, gratis semua. Koleksi pilihan editor.',
      thumb: 't2',
      url: '#',
    },
    {
      id: '5',
      cat: 'Tutorial',
      icon: 'fa-screwdriver-wrench',
      title: 'Cara Setting PPSSPP Anti Lag',
      desc: 'Grafis halus, fps stabil di HP maupun PC jadul.',
      thumb: 't1',
      url: '#',
    },
    {
      id: '6',
      cat: 'Tips',
      icon: 'fa-shield-halved',
      title: 'Proteksi PC dari Virus',
      desc: 'Tanpa antivirus berbayar. 100% efektif, sudah teruji.',
      thumb: 't3',
      url: '#',
    },
    {
      id: '7',
      cat: 'Game PC',
      icon: 'fa-gamepad',
      title: 'Download RDR 2 PC Repack',
      desc: 'Petualangan koboi open world. Size repack terkompres ukuran kecil.',
      thumb: 't1',
      url: '#',
    },
    {
      id: '8',
      cat: 'Tips',
      icon: 'fa-solid fa-triangle-exclamation',
      title: 'Cara Mengatasi BSOD Windows',
      desc: 'Langkah demi langkah mengatasi layar biru kematian yang sering muncul.',
      thumb: 't3',
      url: '#',
    },
    {
      id: '9',
      cat: 'Android',
      icon: 'fa-mobile-screen',
      title: 'Emulator Android Paling Ringan',
      desc: 'Deretan emulator buat PC kentang agar tetap bisa main game berat.',
      thumb: 't2',
      url: '#',
    },
  ];
}

/**
 * Fetch single post dari Blogger by ID
 */
export async function fetchBloggerPostById(postId) {
  if (!BLOG_ID || !API_KEY) {
    return null;
  }

  try {
    const url = new URL(`${BLOGGER_API_URL}/blogs/${BLOG_ID}/posts/${postId}`);
    url.searchParams.append('key', API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return null;
    }

    const post = await response.json();
    
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      published: new Date(post.published).toLocaleDateString('id-ID'),
      author: post.author?.displayName || 'Admin',
      url: post.url,
      labels: post.labels || [],
    };
  } catch (error) {
    console.error('Error fetching single post:', error);
    return null;
  }
}
