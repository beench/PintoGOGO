const express = require("express");
const router = express.Router();
const bcrytpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

const multer = require("multer");
const storageProfile = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads/upload_profile/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadProfile = multer({
  storage: storageProfile,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});

//load input validation
const validationRegisterInput = require("../validator/register");
const validationLoginInput = require("../validator/login");

const User = require("../models/user");
const Address = require("../models/address");
const Order = require("../models/order");
//register
router.post("/register", (req, res) => {
  console.log("in");
  const { errors, isValid } = validationRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ user_name: req.body.user_name }).then(user => {
    if (user) {
      errors.user_name = "Username already exists";
      return res.status(400).json(errors);
    } else {
      const address = req.body.address;
      const newAddress = new Address({
        address: address.address,
        lat: address.lat,
        lng: address.lng,
        distance: address.distance,
        delivery_fee: address.distance * 20,
        owner: req.body.user_name
      });
      const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password1,
        phonenumber: req.body.phonenumber,
        //address : address_id,
        type: req.body.type
      });
      newAddress
        .save()
        .then(address => (newUser.address = address._id))
        .catch(err => console.log(err));

      bcrytpt.genSalt(10, (err, salt) => {
        bcrytpt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//login
router.post("/login", function(req, res) {
  const { errors, isValid } = validationLoginInput(req.body);
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const user_name = req.body.user_name;
  const password = req.body.password;

  User.findOne({ user_name }).then(user => {
    //check for user
    if (!user) {
      errors.user_name = "User not found";
      return res.status(404).json(errors);
    }

    //check password
    bcrytpt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched
        //create jwt payload
        const payload = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          user_name: user.user_name,
          type: user.type,
          favorite_food: user.favorite_food,
          favorite_snack: user.favorite_snack
        };
        //sign token
        jwt.sign(
          payload,
          keys.secretOrkey,
          { expiresIn: 3600 },
          (err, token) => {
            Order.findOne({ user_id: user.id, isfinish: false }, function(
              err,
              order
            ) {
              if (!order) {
                var newOrder = new Order({
                  user_id: user.id
                });
                newOrder.save();
              }
            });
            res.json({
              sucess: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//profile user data
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    User.findById(req.user.id)
      .populate({ path: "address", model: "Address" })
      .populate({ path: "favorite_food", model: "Menu" })
      .populate({ path: "favorite_snack", model: "Snack" })
      .exec((err, user) => {
        if (err) {
          errors.user = "Cannot Fetch Your Profile";
          res.status(400).json(errors);
        } else {
          res.json(user);
        }
      });
  }
);

//update profile
router.put(
  "/edit/profile",
  passport.authenticate("jwt", { session: false }),
  uploadProfile.single("img"),
  (req, res) => {
    const error = {};
    const newUpdate = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phonenumber: req.body.phonenumber,
      img_url: req.body.img_url
    };
    if (req.file) {
      newUpdate.img_url = req.file.path;
    }
    User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          first_name: newUpdate.first_name,
          last_name: newUpdate.last_name,
          phonenumber: newUpdate.phonenumber,
          img_url: newUpdate.img_url
        }
      },
      (err, user) => {
        if (err) {
          error.user = err;
          res.status(500).json(error);
        } else {
          var status = {
            ok: 1,
            message: "Ok edit profile finish"
          };
          res.json(status);
        }
      }
    );
  }
);

//add new address
router.put(
  "/add/address",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const tmpAddress = {};
    const address = req.body.address;
    const newAddress = new Address({
      address: address.address,
      lat: address.lat,
      lng: address.lng,
      distance: address.distance,
      delivery_fee: address.distance * 20,
      owner: req.user.user_name
    });
    newAddress
      .save()
      .then(address => {
        tmpAddress.id = address._id;
        console.log(address);
      })
      .then(() => {
        User.updateOne(
          { _id: req.user.id },
          { $push: { address: tmpAddress.id } },
          (err, user) => {
            if (err) {
              errors.user = err;
              res.status(400).json(errors);
            } else {
              var status = {
                ok: 1,
                message: "Ok add new address finish"
              };
              res.json(status);
            }
          }
        );
      })
      .catch(err => console.log(err));
  }
);
// del some address
router.put(
  "/del/address/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const address_id = req.params.id;
    User.updateOne(
      { _id: req.user.id },
      { $pull: { address: address_id } },
      (err, user) => {
        if (err) {
          errors.user = err;
          res.status(400).json(errors);
        } else {
          Address.deleteOne({ _id: address_id })
            .then(console.log("Success"))
            .catch(err => {
              console.log(err);
            });
          var status = {
            ok: 1,
            message: "Ok delete some address finish"
          };
          res.json(status);
        }
      }
    );
  }
);

//add favorite food
router.put(
  "/add/favorite/food/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    var foodid = req.params.id;
    User.updateOne(
      { _id: req.user.id },
      { $push: { favorite_food: foodid } },
      (err, user) => {
        if (err) {
          errors.user = err;
          res.status(400).json(errors);
        } else {
          var status = {
            ok: 1,
            message: "Ok add favorite food finish"
          };
          res.json(status);
        }
      }
    );
  }
);

//delete some  favorite food
router.delete(
  "/del/favorite/food/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    var foodid = req.params.id;
    User.updateOne(
      { _id: req.user.id },
      { $pull: { favorite_food: foodid } },
      (err, user) => {
        if (err) {
          errors.user = err;
          res.status(400).json(errors);
        } else {
          var status = {
            ok: 1,
            message: "Ok remove some favorite finish"
          };
          res.json(status);
        }
      }
    );
  }
);

//add favorite snack
router.put(
  "/add/favorite/snack/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    var snackid = req.params.id;
    User.updateOne(
      { _id: req.user.id },
      { $push: { favorite_snack: snackid } },
      (err, user) => {
        if (err) {
          errors.user = err;
          res.status(400).json(errors);
        } else {
          var status = {
            ok: 1,
            message: "Ok add favorite snack finish"
          };
          res.json(status);
        }
      }
    );
  }
);

//delete some  favorite snack
router.delete(
  "/del/favorite/snack/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    var snackid = req.params.id;
    User.updateOne(
      { _id: req.user.id },
      { $pull: { favorite_snack: snackid } },
      (err, user) => {
        if (err) {
          errors.user = err;
          res.status(400).json(errors);
        } else {
          var status = {
            ok: 1,
            message: "Ok remove favorite snack finish"
          };
          res.json(status);
        }
      }
    );
  }
);

module.exports = router;
