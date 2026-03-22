import { fetchBloggerPosts } from '@/lib/blogger';

export async function GET(request) {
  try {
    console.log('📡 /api/blogger-posts called');
    
    // Get limit from query params, default to 6
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    console.log('   Limit:', limit);

    // Fetch all posts from Blogger
    const allPosts = await fetchBloggerPosts();
    console.log('   Total posts fetched:', allPosts.length);

    // Return only the requested number of posts
    const posts = allPosts.slice(0, limit);
    console.log('   Returning:', posts.length, 'posts');

    return Response.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('❌ Error in /api/blogger-posts:', error.message);
    return Response.json(
      { error: 'Failed to fetch posts', details: error.message },
      { status: 500 }
    );
  }
}
