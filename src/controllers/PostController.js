const Post = require("../models/Post");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = {
  async index(req, res) {
    const post = await Post.find().sort("-createdAt");
    return res.json(post);
  },

  async store(req, res) {
    const { author, place, description, hashtags } = req.body;
    const { size, key, location: url = "", filename: image } = req.file;
    let postObj = {};

    if (typeof key === "undefined") {
      await sharp(req.file.path)
        .resize(500)
        .jpeg({ quality: 70 })
        .toFile(path.resolve(req.file.destination, "resized", fileName));

      fs.unlinkSync(req.file.path); // Apaga do diretório uploads (fotos sem resize)

      const [name] = image.split(".");
      let fileName = `${name}.jpg`;
      fileName = fileName.replace(" ", "");

      postObj = {
        author,
        place,
        description,
        hashtags,
        image: fileName,
        key: fileName,
        size,
        url
      };
    } else {
      postObj = {
        author,
        place,
        description,
        hashtags,
        image: key,
        key,
        size,
        url
      };
    }

    const post = await Post.create(postObj);

    req.io.emit("post", post);

    return res.json(post);
  },

  async remove(req, res) {
    const post = await Post.findById(req.params.id);
    await post.remove();
    return res.send(`Post ${req.params.id} has been deleted!`);
  }
};
