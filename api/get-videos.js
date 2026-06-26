const API_KEY = process.env.YOUTUBE_API_KEY;

export default async function handler(req, res) {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'URL नहीं मिला' });

    try {
        const videoMatch = url.match(/[?&]v=([^&]+)/);
        if (videoMatch) {
            const videoId = videoMatch[1];
            return res.json([{
                id: videoId,
                title: 'वीडियो डाउनलोड',
                thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            }]);
        }

        const channelMatch = url.match(/(?:@|channel\/)([^\/?]+)/);
        if (!channelMatch) return res.status(400).json({ error: 'सही YouTube URL डालें' });

        const channelHandle = channelMatch[1];
        const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelHandle}&type=channel&key=${API_KEY}`);
        const searchData = await searchRes.json();

        if (!searchData.items) return res.status(404).json({ error: 'Channel नहीं मिला' });

        const channelId = searchData.items[0].snippet.channelId;
        let allVideos = [];
        let nextPageToken = '';

        do {
            const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50&pageToken=${nextPageToken}`);
            const videosData = await videosRes.json();
            allVideos = allVideos.concat(videosData.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url
            })));
            nextPageToken = videosData.nextPageToken || '';
        } while (nextPageToken);

        res.json(allVideos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
