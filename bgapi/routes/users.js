const express = require('express');
const router = express.Router();
const UserService = require('../services/user_service');

const us = new UserService();

var bodyParser = require('body-parser')
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

router.get("/all", async function(req, res, next) {
  try {
      let users = await us.getUserList();
      res.status(200).send(users);
  }
  catch(err) {
      return next(err);
  }
});

router.get("/:id", async function(req, res, next) {
  try {
      let user = await us.getUser(req.params.id);
      res.status(200).send(user);
  }
  catch(err) {
      return next(err);
  }
});


router.post("/", async function(req, res, next) {
  const name = req.body.name;

  try {
    if(!name)  {
      let err = new Error('Name is missing');
      err.status = 400;
      throw err;
    }
  
    let user = await us.createUser(name);
    res.status(200).send({user_id:user.id});
  }
  catch(err) {
    return next(err);
  }
});

router.delete("/:id", async function(req, res, next) {
  try {
      await us.deleteUser(req.params.id);
      res.status(200).send();
  }
  catch(err) {
      return next(err);
  }
});

router.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack
  })
})

module.exports = router;
