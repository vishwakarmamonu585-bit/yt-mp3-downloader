const API_KEY = 'AIzaSyDQyPGZ9p-6FPmLfW1-ijllDrZjn5cBFRU';

exports.handler = async (event) => {
    const url = event.queryStringParameters.url;
    if (!url) return { statusCode: 400, body: 'URL नहीं मिला' };

    try {
        // ✅ पहले चेक करें – क्या यह एक वीडियो का URL है?
        const videoMatch = url.match(/[?&]v=([^&]+)/);
        if (videoMatch) {
            // एक वीडियो – सिर्फ उसका डेटा भेजें
            const videoId = videoMatch[1];
            const singleVideo = [{
                id: videoId,
                title: 'वीडियो डाउनलोड हो रहा है...',
                thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            }];
            return { statusCode: 200, body: JSON.stringify(singleVideo) };
        }

        // ❌ नहीं तो चैनल हैंडल निकालें
        const channelMatch = url.match(/(?:@|channel\/)([^\/?]+)/);
        if (!channelMatch) return { statusCode: 400, body: JSON.stringify({ error: 'सही YouTube URL डालें' }) };
        const channelHandle = channelMatch[1];

        // YouTube API से Channel ID प्राप्त करें
        const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelHandle}&type=channel&key=${API_KEY}`);
        const searchData = await searchRes.json();
        if (!searchData.items || searchData.items.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ error: 'Channel नहीं मिला' }) };
        }
        const channelId = searchData.items[0].snippet.channelId;

        // Channel के सारे वीडियो प्राप्त करें
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

        return { statusCode: 200, body: JSON.stringify(allVideos) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
