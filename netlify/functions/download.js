
exports.handler = async (event) => {
    const videoId = event.queryStringParameters.videoId;
    if (!videoId) return { statusCode: 400, body: 'Video ID नहीं मिला' };

    // YouTube से डायरेक्ट ऑडियो लिंक
    const audioUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    return {
        statusCode: 200,
        headers: {
            'Location': audioUrl,
            'Content-Type': 'audio/mpeg'
        },
        body: 'MP3 डाउनलोड शुरू हो रहा है...'
    };
};
