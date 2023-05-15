var ImageKit = require("imagekit");
const { uuid } = require("uuidv4");
const _ = require("lodash");

var imagekit = new ImageKit({
  publicKey: "public_elJYwM7uV3lJ2N0W95gaIryBusY=",
  privateKey: "private_+szOtMJTYmOz/stbekjmq0fu5qY=",
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/",
});

const logoutUser = async (req, res, next) => {
  try {
    const { body } = req;

    const promises = await body.image.map(async (file) => {
      const numFruit = new Promise((resolve, reject) => {
        const image = imagekit.upload(
          {
            file: file, //required
            fileName: uuid(), //required
          },
          function (error, result) {
            if (error) console.log(error);
            else {
              resolve(result);
            }
          }
        );
      });
      return numFruit;
    });

    const result = await Promise.all(promises);

    res.send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = logoutUser;
