export default async function handler(req, res) {
    const videoId = req.query.videoId;
    if (!videoId) return res.status(400).json({ error: 'Video ID नहीं मिला' });

    const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
    res.redirect(youtubeLink);
}
