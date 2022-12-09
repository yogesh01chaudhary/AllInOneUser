const validator = require("../validators/validators");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Mail = require("../models/mail");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  Bucket: process.env.BUCKET_NAME,
});
const { geocoder } = require("../helpers/geoCoder");
const Joi = require("joi/lib");

//================================================= phone login ==============================================//
exports.phoneLogin = (req, res) => {
  try {
    const { error } = validator.phoneSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    axios
      .get(process.env.OTP_API + req.body.phone + "/AUTOGEN")
      .then((response) => {
        return res.status(200).json({
          message: "OTP sent successfully",
        });
      })
      .catch((er) => {
        return res.status(500).json({ message: "Error", error: er.message });
      });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//=================================================== verify otp ===============================================//
exports.verifyOTP = (req, res) => {
  try {
    const { error } = validator.otpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    axios
      .get(
        process.env.OTP_API + "VERIFY3/" + req.body.phone + "/" + req.body.otp
      )
      .then(async (response) => {
        if (response.data.Details === "OTP Matched") {
          const isAlreadyRegistered = await User.findOne({
            phone: req.body.phone,
          });
          if (isAlreadyRegistered && isAlreadyRegistered.firstName) {
            const _id = isAlreadyRegistered._id.toString();
            const refreshToken = uuidv4();
            const makeRefreshToken = await RefreshToken.findOneAndUpdate(
              {
                user_id: _id,
              },
              {
                refreshToken: refreshToken,
              },
              { upsert: true, new: true }
            );
            if (!makeRefreshToken) {
              return res.status(500).json({ message: "Something went wrong" });
            }
            const token = jwt.sign({ _id: _id }, process.env.JWT_SECRET, {
              expiresIn: "24h",
            });
            return res.status(200).json({
              message: "Welcome back",
              token: token,
              refreshToken: refreshToken,
              user_id: _id,
            });
          }
          if (isAlreadyRegistered) {
            const _id = isAlreadyRegistered._id.toString();
            const refreshToken = uuidv4();
            const makeRefreshToken = await RefreshToken.findOneAndUpdate(
              {
                user_id: _id,
              },
              {
                refreshToken: refreshToken,
              },
              { upsert: true, new: true }
            );
            if (!makeRefreshToken) {
              return res.status(500).json({ message: "Something went wrong" });
            }
            const token = jwt.sign({ _id: _id }, process.env.JWT_SECRET, {
              expiresIn: "24h",
            });
            return res.status(200).json({
              message: "Registered successful",
              token: token,
              refreshToken: refreshToken,
              user_id: _id,
            });
          }
          const createUser = new User({
            phone: req.body.phone,
          });
          const createdUser = await createUser.save();
          if (createdUser) {
            const _id = createdUser._id.toString();
            const refreshToken = uuidv4();
            const makeRefreshToken = await RefreshToken.findOneAndUpdate(
              {
                user_id: _id,
              },
              {
                refreshToken: refreshToken,
              },
              { upsert: true, new: true }
            );
            if (!makeRefreshToken) {
              return res.status(500).json({ message: "Something went wrong" });
            }
            const token = jwt.sign({ _id: _id }, process.env.JWT_SECRET, {
              expiresIn: "24h",
            });
            return res.status(201).json({
              message: "Registered successful",
              token: token,
              refreshToken: refreshToken,
              user_id: _id,
            });
          }
          return res.status(500).json({ message: "Something bad happened" });
        } else if (response.data.Details === "OTP Expired") {
          return res.status(403).json({ message: "OTP Expired" });
        } else if (response.data.Details === "OTP Mismatch") {
          return res.status(403).json({ message: "OTP Mismatch" });
        }
        return res.status(500).json({ message: "Something went wrong 1" });
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//================================================ update profile ===============================================//
exports.updateProfile = async (req, res) => {
  try {
    const { error } = validator.profileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let address = `${req.body.city},${req.body.pincode}`;

    const loc = await geocoder.geocode(address);

    let longitude = req.body.longitude || loc[0].longitude;
    let latitude = req.body.latitude || loc[0].latitude;
    let location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    const update = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...req.body,
        location,
      },
      { new: true }
    );
    if (update) {
      return res.status(200).json({ message: "Profile Updated successfully" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: e.message });
  }
};

//=================================================== update coordinates ========================================//
exports.updateCoordinates = async (req, res) => {
  try {
    const { user, body } = req;
    const { error } = Joi.object()
      .keys({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        // _id: Joi.string().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }

    let result = await User.findByIdAndUpdate(
      user._id,
      {
        "location.coordinates": [body.longitude, body.latitude],
      },
      { new: true }
    );
    if (!result) {
      return res.status(404).send({ success: true, message: "No Data Found" });
    }
    return res.status(200).send({
      success: true,
      message: "User coordinates Updated Successfully",
      result: result.location,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Something went wong",
      error: e.message,
    });
  }
};

//=================================================== update mobile number ========================================//
exports.changePhone = (req, res) => {
  try {
    const { error } = validator.otpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    axios
      .get(
        process.env.OTP_API + "VERIFY3/" + req.body.phone + "/" + req.body.otp
      )
      .then(async (response) => {
        if (response.data.Details === "OTP Matched") {
          const updatePhone = await User.findByIdAndUpdate(req.user._id, {
            phone: req.body.phone,
          });

          if (updatePhone) {
            return res.status(200).json({ message: "Updated successfully" });
          }
          return res.status(500).json({ message: "Something went wrong" });
        } else if (response.data.Details === "OTP Expired") {
          return res.status(403).json({ message: "OTP Expired" });
        }
        return res.status(500).json({ message: "Something went wrong" });
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//============================================= get my profile =======================================================//
exports.getMyProfile = async (req, res) => {
  try {
    const myProfile = await User.findById(req.user._id);
    if (myProfile) {
      return res.status(200).json({ result: myProfile });
    }
    return res.status(500).json({ message: "Something went wrong" });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//========================================= send otp to mail =======================================================//
exports.sendMailOTP = async (req, res) => {
  try {
    const { error } = validator.emailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const createOTP = new Mail({
      OTP: Number(otp),
      email: req.body.email,
    });
    createOTP
      .save()
      .then(async (val) => {
        let transporter = nodemailer.createTransport({
          service: process.env.SERVICE,
          host: process.env.HOST,
          port: process.env.PORTMAIL,
          secure: false,
          auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
          },
        });
        let info = await transporter.sendMail({
          from: process.env.USER,
          to: req.body.email,
          subject: "OTP",
          html: `Hi your OTP is ${otp}`,
        });

        if (info.accepted.length !== 0) {
          return res
            .status(200)
            .json({ message: "OTP sent successfully", id: val._id });
        }
        return res.status(500).json({ message: "Something went wrong" });
      })
      .catch((e) => {
        res.status(500).send({ message: e.name });
      });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//======================================= verify email otp =================================================//
exports.verifyMailOTP = async (req, res) => {
  try {
    const { error } = validator.verifyEmailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const verifyOTP = await Mail.findById(req.body.id);
    if (!verifyOTP) {
      return res.status(403).json({ message: "OTP expired" });
    }
    if (verifyOTP.OTP !== req.body.otp) {
      return res.status(400).json({ message: "Wrong OTP" });
    }
    if (verifyOTP.OTP === req.body.otp) {
      const updateEmail = await User.findByIdAndUpdate(req.user._id, {
        email: verifyOTP.email,
      });
      if (updateEmail) {
        return res.status(200).json({ message: "Email successfully updated" });
      }
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//==================================== upload profile picture =============================================//
exports.uploadProfilePicture = async (req, res) => {
  try {
    const { error } = validator.uploadPictureSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}.${fileType}`,
      Body: req.file.buffer,
    };
    s3.upload(params, async (error, data) => {
      if (error) {
        return res.status(500).send(error);
      }
      const result = await parentdb.findByIdAndUpdate(req.user._id, {
        imageUrl: data.Location,
      });
      if (result) {
        return res
          .status(200)
          .json({ message: "uploaded Profile Picture successfully" });
      }
      return res.status(500).json({ message: "Something bad happened" });
    });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//===================================== update profile picture =========================================//
exports.updateProfilePicture = async (req, res) => {
  try {
    const { error } = validator.updatePictureSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}.${fileType}`,
      Body: req.file.buffer,
    };
    s3.upload(params, async (error, dataResult) => {
      if (error) {
        return res.status(500).send(error);
      }
      let p = req.body.imageUrl;
      if (p) {
        p = p.split("/");
        p = p[p.length - 1];
        const params1 = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: p,
        };
        const s3delete = function (params) {
          return new Promise((resolve, reject) => {
            s3.createBucket(
              {
                Bucket: params.Bucket,
              },
              function () {
                s3.deleteObject(params, async function (err, data) {
                  if (err) return res.status(500).send({ message: err });
                  const result = await parentdb.findByIdAndUpdate(
                    req.user._id,
                    {
                      imageUrl: dataResult.Location,
                    }
                  );
                  if (result) {
                    return res
                      .status(200)
                      .send({ message: "Image updated successfully" });
                  }
                  return res
                    .status(500)
                    .send({ message: "Something bad happened" });
                });
              }
            );
          });
        };
        s3delete(params1);
      } else {
        const result = await parentdb.findByIdAndUpdate(req.user._id, {
          imageUrl: data.Location,
        });
        if (result) {
          return res.status(200).send("updated sucessfully");
        }
        return res.status(500).send({ message: "Something went wrong" });
      }
    });
  } catch (e) {
    return res.status(500).send({ message: e.name });
  }
};

//=================================== refresh token ================================================//
exports.refreshToken = async (req, res) => {
  try {
    const { error } = validator.refreshTokenSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newRefreshToken = uuidv4();
    const refresh = await RefreshToken.findOneAndUpdate(
      { user_id: req.body.user_id, refreshToken: req.body.refreshToken },
      {
        refreshToken: newRefreshToken,
      },
      { new: true }
    );
    if (!refresh) {
      return res.status(400).json({ message: "Wrong refresh token" });
    }
    const token = jwt.sign({ _id: req.body.user_id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return res
      .status(200)
      .json({ refreshToken: newRefreshToken, token: token });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};


//@desc get s3Url fro newOne and for update image check in DB imageUrl
//@route GET/vendor/s3Url1
//@access Private
exports.s3Url = async (req, res) => {
  try {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET,
    });
    console.log(s3,req.user)
    const { _id } = req.user;
    let user = await User.findById(_id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User Doesn't Exists" });
    }
    if (!user.imageUrl) {
      const key = `${_id}/${uuidv4()}.jpeg`;
      const url = await s3.getSignedUrlPromise("putObject", {
        Bucket: process.env.AWS_BUCKET_NAME,
        ContentType: "image/jpeg",
        Key: key,
        Expires: 120,
      });
      return res.status(200).send({
        success: true,
        message: "Url generated , imageUrl doesn't exists in DB",
        url,
        key,
      });
    }

    let fileName = user.imageUrl.split("/");
    fileName =
      fileName[fileName.length - 2] + "/" + fileName[fileName.length - 1];
    const key = `${fileName}`;
    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      ContentType: "image/jpeg",
      Key: key,
      Expires: 60,
    });
    return res
      .status(200)
      .send({ success: true, message: "Url generated", url, key });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
};

//@desc Upload imageUrl in DB using  S3
//@route PUT/vendor/imageUrl
//@access Private
exports.updateImageUrl = async (req, res) => {
  try {
    const { user, body } = req;
    Joi.object()
      .keys({
        body: Joi.object().keys({
          imageUrl: Joi.string().required(),
        }),
        user: Joi.object().keys({
          _id: Joi.string().required(),
        }),
      })
      .required()
      .validate(req);
    let userData = await User.findByIdAndUpdate(
      user._id,
      { imageUrl: body.imageUrl },
      { new: true }
    );
    if (!userData) {
      return res
        .status(404)
        .send({ success: false, message: "User Doesn't Exists" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Image Url Updated", imageurl:userData.imageUrl});
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
};

//@desc delete image from s3 Bucket and DB
//@route DELETE vendor/imageUrl
//@access Private
exports.deleteImageUrl = async (req, res) => {
  try {
    const { _id } = req.user;

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET,
    });

    let fileName = req.body.imageUrl.split("/");
    fileName =
      fileName[fileName.length - 2] + "/" + fileName[fileName.length - 1];
    const key = `${fileName}`;
    var params = { Bucket: process.env.AWS_BUCKET_NAME, Key: key };
    let user = await User.findById(_id);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User Doesn't Exists" });
    }

    if (user.imageUrl !== req.body.imageUrl) {
      return res.status(400).send({
        success: false,
        message:
          "Can't be deleted imageUrl doesn't match with User's imageUrl",
      });
    }

    s3.deleteObject(params, async (err) => {
      if (err)
        return res.status(500).send({
          success: false,
          message: "Something went wrong",
          error: err.message,
        });
        await User.findByIdAndUpdate(
        _id,
        { imageUrl: "" },
        { new: true }
      );
      return res
        .status(200)
        .send({ success: true, message: "Successfully Deleted" });
    });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
};