exports.handler = async (event) => {
    const url = event.queryStringParameters.url;
    if (!url) return { statusCode: 400, body: 'URL नहीं मिला' };

    const dummyData = [
        { id: 'video1', title: 'टेस्ट वीडियो 1', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
        { id: 'video2', title: 'टेस्ट वीडियो 2', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
        { id: 'video3', title: 'टेस्ट वीडियो 3', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' }
    ];
    return { statusCode: 200, body: JSON.stringify(dummyData) };
};
