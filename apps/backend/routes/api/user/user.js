const express = require('express')
const router = express.Router();

const { findAll, findOne } = require('../../../models/users');


router.get('/', async (req, res) => {
  const users = await findAll();
  if(!users)
    res.send("Users not found")
  else
    res.send(users);
})

router.get('/:userId',async (req, res) => {
  const { userId } = req.params;
  const user = await findOne(userId)
  if(!user)
  {
    // 404 Not found
    res.status(404).send('The user with the given ID was not found!')
  }
  res.send(user);
});

module.exports = router;
