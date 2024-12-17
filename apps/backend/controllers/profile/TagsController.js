const db =  require('../../db/db');

// get the tags that the user can add to their profile
exports.getTagsList = async (req, res) => {
    try {
        const result = await db.query('SELECT id, tag FROM tags_list');
        res.status(200).json({ tags: result.rows });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: 'Error fetching tags' });
    }
}