const API_KEY = 'AIzaSyDQyPGZ9p-6FPmLfW1-ijllDrZjn5cBFRU';

exports.handler = async (event) => {
    const url = event.queryStringParameters.url;
    if (!url) return { statusCode: 400, body: 'URL नहीं मिला' };

    try {
        const channelMatch = url.match(/(?:@|channel\/)([^\/?]+)/);
        if (!channelMatch) return { statusCode: 400, body: 'सही YouTube URL डालें' };
        const channelHandle = channelMatch[1];

        const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelHandle}&type=channel&key=${API_KEY}`);
        const searchData = await searchRes.json();
        if (!searchData.items || searchData.items.length === 0) {
            return { statusCode: 404, body: 'Channel नहीं मिला' };
        }
        const channelId = searchData.items[0].snippet.channelId;

        const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=20`);
        const videosData = await videosRes.json();

        const videos = videosData.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url
        }));

        return { statusCode: 200, body: JSON.stringify(videos) };
    } catch (err) {
        return { statusCode: 500, body: 'Error: ' + err.message };
    }
};
