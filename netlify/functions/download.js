const ytdl = require('ytdl-core');

exports.handler = async (event) => {
    const videoId = event.queryStringParameters.videoId;
    if (!videoId) return { statusCode: 400, body: 'Video ID नहीं मिला' };

    try {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await ytdl.getInfo(url);
        
        // सबसे अच्छा ऑडियो फॉर्मेट चुनें (320kbps के करीब)
        const audioFormat = ytdl.chooseFormat(info.formats, {
            quality: 'highestaudio',
            filter: 'audioonly'
        });

        if (!audioFormat) {
            return { statusCode: 404, body: 'ऑडियो फॉर्मेट नहीं मिला' };
        }

        // ऑडियो स्ट्रीम को बेस64 में बदलकर डाउनलोड कराएँ
        const audioStream = ytdl(url, { format: audioFormat });
        const chunks = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': `attachment; filename="${videoId}.mp3"`
            },
            body: buffer.toString('base64'),
            isBase64Encoded: true
        };
    } catch (err) {
        return { statusCode: 500, body: 'Error: ' + err.message };
    }
};
