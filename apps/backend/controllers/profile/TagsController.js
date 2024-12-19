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

exports.getUserTags = async (req, res) => {
    try{
        console.log("geting tags of a given user: ", req.params.id);
        const result = await db.query(
            'SELECT tag FROM tags WHERE user_id = $1', [req.params.id]
        );
        console.log("USER_TAGS: ", result.rows.map(tagObj => `${tagObj.tag}`));
        res.status(200).json({USER_TAGS: result.rows.map(tagObj => `${tagObj.tag}`) });
    
    }
    catch(error) {
        console.log('Error fetching user tags: ', error);
        res.status(500).json({message: 'Error fetching tags'});
    }
}