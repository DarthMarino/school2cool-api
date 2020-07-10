const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const { reset } = require("nodemon");
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router();

router.post("/users/signUp", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// returns the user that is authenticated
router.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

// middleware for uploading a profile picture
const upload = multer({
  // limits: {
  //   fileSize: 1000000
  // },
  fileFilter(req, file, cb) {
      if(!file.originalname.match(/\.(jpg|jpeg|png|)$/)) {
          return cb(new Error('Please upload an image'))
      }
      cb(undefined, true)
  }
})
// save a profile picture for the authenticated user.
router.post("/users/me/picture", auth, upload.single('picture'), async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer).resize({ width: 250, height:250 }).png().toBuffer()
      req.user.picture = buffer
      await req.user.save()
      res.send(req.user.picture)
    } catch (e) {
      res.status(400).send()
    }
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})
// get a user's profile picture by the user's id
router.get("/users/:id/picture", auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      if (!user || !user.picture) {
        throw new Error()
      }
      res.set('Content-Type', 'image/png')
      res.send(user.picture)
    } catch (e) {
      res.status(404).send()
    }
})

router.post("/users/logout", auth, async (req, res) => {
  try {
    // userToken is an object with 2 members: _id, token
    req.user.tokens = req.user.tokens.filter(
      (userToken) => userToken.token !== req.token
    );
    await req.user.save();
    res.send("User successfully logged out");
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users", async (req, res) => {
  let students_list = await User.find({}, [
    "_id",
    "name",
    "lastName",
    "username",
  ]);
  try {
    res.status(201).send(
      (await students_list).map((user) => {
        return {
          id: user._id,
          name: user.name + " " + user.lastName,
          userName: user.username,
        };
      })
    );
  } catch (e) {
    res.status(400);
  }
});

module.exports = router;
