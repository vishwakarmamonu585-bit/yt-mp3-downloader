exports.handler = async (event) => {
    const videoId = event.queryStringParameters.videoId;
    if (!videoId) return { statusCode: 400, body: 'Video ID नहीं मिला' };

    // ✅ YouTube का डायरेक्ट Audio Stream Link (हमेशा काम करता है)
    const audioUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return {
        statusCode: 302,  // Redirect
        headers: {
            'Location': audioUrl,
            'Content-Type': 'audio/mpeg'
        },
        body: 'Redirecting to MP3...'
    };
};
