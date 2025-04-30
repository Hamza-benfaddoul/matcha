const db =  require('../../db/db');

exports.addBlock = async (req, res) => {
    // const blocker_id = req.params.id;

    const blocked_id = req.body.blocked_id;
    const blocker_id = req.body.blocker_id;
    const query = `INSERT INTO blocks (blocker_id, blocked_id) VALUES ($1, $2) RETURNING *`;
    const values = [blocker_id, blocked_id];
    try {
        const result = await db.query(query, values);
        const newBlock = result.rows[0];
        res.status(201).json({
            message: 'User blocked successfully',
            block: newBlock,
        });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({
            message: 'Error blocking user',
            error: error.message,
        });
    }
}

exports.removeBlock = async (req, res) => {
    const blocker_id = req.params.id;
    const blocked_id = req.body.blocked_id;
    const query = `DELETE FROM blocks WHERE blocker_id = $1 AND blocked_id = $2 RETURNING *`;
    const values = [blocker_id, blocked_id];
    try {
        const result = await db.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Block not found',
            });
        }
        res.status(200).json({
            message: 'User unblocked successfully',
            block: result.rows[0],
        });
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({
            message: 'Error unblocking user',
            error: error.message,
        });
    }
}

exports.getUserBlocks = async (req, res) => {
    const user_id = req.userId;

    console.log('user_id', user_id);
    const query = `
        SELECT 
            blocks.blocked_id,
            users.id AS user_id,
            users.firstName,
            users.lastName,
            users.username,
            users.email,
            users.profile_picture,
            users.fame_rating,
            users.location_latitude,
            users.location_longitude,
            users.gender,
            users.biography
        FROM blocks
        INNER JOIN users ON blocks.blocked_id = users.id
        WHERE blocks.blocker_id = $1
    `;
    const values = [user_id];
    try {
        const result = await db.query(query, values);
        console.log('result', result.rows);
        res.status(200).json({
            message: 'User blocks retrieved successfully',
            blocks: result.rows,
        });
    } catch (error) {
        console.error('Error retrieving user blocks:', error);
        res.status(500).json({
            message: 'Error retrieving user blocks',
            error: error.message,
        });
    }
}