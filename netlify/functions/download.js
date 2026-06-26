const ytdl = require('ytdl-core');

exports.handler = async (event) => {
    const videoId = event.queryStringParameters.videoId;
    if (!videoId) return { statusCode: 400, body: 'Video ID नहीं मिला' };

    try {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await ytdl.getInfo(url);
        const audioFormat = ytdl.chooseFormat(info.formats, { 
            quality: 'highestaudio',
            filter: 'audioonly'
        });

        if (!audioFormat) {
            return { statusCode: 404, body: 'ऑडियो फॉर्मेट नहीं मिला' };
        }

        // 320kbps MP3 के लिए सीधा डाउनलोड लिंक
        const downloadUrl = audioFormat.url;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': `attachment; filename="${videoId}.mp3"`,
                'Location': downloadUrl
            },
            body: JSON.stringify({ 
                message: 'MP3 डाउनलोड शुरू हो रहा है', 
                url: downloadUrl 
            })
        };
    } catch (err) {
        return { statusCode: 500, body: 'Error: ' + err.message };
    }
};
