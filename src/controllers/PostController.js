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
    const { size, location: url = "", filename: image } = req.file;

    const [name] = image.split(".");
    let fileName = `${name}.jpg`;
    fileName = fileName.replace(" ", "");

    await sharp(req.file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(path.resolve(req.file.destination, "resized", fileName));

    fs.unlinkSync(req.file.path); // Apaga do diretório uploads (fotos sem resize)

    const post = await Post.create({
      author,
      place,
      description,
      hashtags,
      image: fileName,
      size,
      url
    });

    req.io.emit("post", post);

    return res.json(post);
  },

  async remove(req, res) {
    const post = await Post.findById(req.params.id);
    await post.remove();
    return res.send(`Post ${req.params.id} has been deleted!`);
  }
};
