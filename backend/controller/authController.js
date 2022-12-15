const { response } = require("express");
const formidable = require("formidable");
const validator = require("validator");
const registerModel = require("../models/authModel");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.userRegister = (req, res) => {
  // console.log("Registration is working.");
  // console.log(res.fields);
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    // console.log(fields);
    // console.log(files);

    const { userName, email, password, confirmPassword } = fields;

    const { image } = files;
    const error = [];

    if (!userName) {
      error.push("Please provide your User name");
    }

    if (!email) {
      error.push("Please provide your Email address");
    }

    if (email && !validator.isEmail(email)) {
      error.push("Please provide your valid Email address");
    }

    if (!password) {
      error.push("Please provide your Password");
    }

    if (!confirmPassword) {
      error.push("Please provide your confirm Password");
    }

    if (password && confirmPassword && password !== confirmPassword) {
      error.push("Your Password and Confirm Password are not the same");
    }

    if (password && password.length < 6) {
      error.push("Your Password muss be at least 6 characters long");
    }

    if (Object.keys(files).length === 0) {
      error.push("Please provide your image");
    }
    if (error.length > 0) {
      res.status(400).json({
        error: {
          errorMessage: error,
        },
      });
    } else {
      const getImageName = files.image.originalFilename;
      const randomNumber = Math.floor(Math.random() * 99999);
      const newImageName = randomNumber + getImageName;
      files.image.originalFilename = newImageName;
      // console.log(getImageName);
      // console.log(newImageName);

      // const newPath =
      //   __dirname +
      //   `../../../frontend/public/images/${files.image.originalFilename}`;
      // console.log(newPath);

      // const newPath = `/home/user/assignments/live-chat(3)/frontend/public/images/${files.image.originalFilename}`;

      const newPath = path.join(
        `/home/user/assignments/live-chat(3)/frontend/public/images/${files.image.originalFilename}`
      );

      try {
        const checkUser = await registerModel.findOne({
          email: email,
        });
        if (checkUser) {
          res.status(404).json({
            error: {
              errorMessage: ["Your email address already existed!"],
            },
          });
        } else {
          fs.copyFile(files.image.filepath, newPath, async (error) => {
            if (!error) {
              const userCreate = await registerModel.create({
                userName,
                email,
                password: await bcrypt.hash(password, 10),
                image: files.image.originalFilename,
              });
              console.log("Registration completed in Data Bank successfully.");
              const token = jwt.sign(
                {
                  id: userCreate._id,
                  email: userCreate.email,
                  userName: userCreate.userName,
                  image: userCreate.image,
                  registerTime: userCreate.createdAt,
                },
                process.env.SECRET,
                {
                  expiresIn: process.env.TOKEN_EXP,
                }
              );
              const options = {
                expires: new Date(
                  Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
                ),
              };

              res.status(201).cookie("authToken", token, options).json({
                successMessage: "Your Token Registered Successfully",
                token,
              });
            } else {
              res.status(500).json({
                error: {
                  errorMessage: ["Internal Server Error"],
                },
              });
            }
          });
        }
      } catch (error) {
        res.status(500).json({
          error: {
            errorMessage: ["Internal Server Error"],
          },
        });
      }
    }
  }); // end Formidable
};
