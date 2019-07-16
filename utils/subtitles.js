const MatroskaSubtitles = require("matroska-subtitles");
const router = require("express").Router();
const path = require("path");
const fs = require("fs");

let client = require("./client");

router.get("/get-subs", async (req, res, next) => {
  try {
    await clearFolder();
  } catch (error) {
    console.log(error);
  }
  fs.readdir(path.join(__dirname, "tmp"), (err, data) => {
    if (err) throw err;
    if (data.length === 0) return; //throw "No video file exists (substitles.js)";
    setTimeout(() => {
      parseSubs(path.join(__dirname, "tmp", data[0]));
    }, 3000);
  });
  res.json({ msg: "Subbing started" });
});

router.get("/get-track/:time", (req, res, next) => {
  let time = req.params.time;
  let sub = [];

  fs.readdir(path.join(__dirname, "..", "subs"), (err, data) => {
    data.forEach(file => {
      let subdata = fs.readFileSync(path.join(__dirname, "..", "subs", file));
      sub.push(JSON.parse(subdata));
    });
    res.json({ subtitle: sub });
  });
  //res.json({ subtitle: req.params.time });
});

const parseSubs = file => {
  let parser = new MatroskaSubtitles();
  let magnet = client.torrents[0].magnetURI;
  let tor = client.get(magnet);
  let fl = tor.files[0];
  let subStream = fl.createReadStream();
  parser.once("tracks", tracks => {
    console.log(tracks);
  });
  parser.on("subtitle", (sub, trackNum) => {
    fs.writeFile(`subs/${sub.time}.json`, JSON.stringify(sub), err => {
      if (err) throw err;
      console.log(`subbing`);
    });
  });
  subStream.pipe(parser);
};

// TODO: code reuse, make this method a global helper
const clearFolder = () => {
  return new Promise((resolve, error) => {
    fs.readdir(path.join(__dirname, "..", "subs"), (err, data) => {
      if (data.length == 0) resolve();
      if (err) {
        console.log(`Couldn't read directory ${err}`);
        error("Error opening temp folder");
      }
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        fs.unlink(path.join(__dirname, "..", "subs", data[i]), err => {
          if (err) {
            error("Error clearing temp folder");
          }
          resolve("tmp was cleared");
        });
      }
    });
  });
};

module.exports = router;
