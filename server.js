const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).render("index");
});

// Set Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",

  filename: (req, file, cb) => {
    console.log(file);
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Allowed only .png, .jpg, .jpeg"));
  }

  // check file Type: Traversy
  // checkFileType(file, cb);
  // function checkFileType(file, cb) {
  // Allowed ext
  // const filetypes = /jpeg|jpg|png|gif/;
  //check ext
  // const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  // const mimetype = filetypes.test(file.mimetype);
  // if(mimetype && extname){
  //   return cb(null, true);
  // } else {
  // cb('Error: Images only!');
  // }
  // }
};

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: fileFilter,
}).single("myImage");

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err,
      });
    } else {
      // console.log(req.file);
      if (req.file == undefined) {
        res.render("index", {
          msg: "Error:No File Selected!",
        });
      } else {
        res.render("index", {
          msg: "File Uploaded!",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`This app is listening on port ${PORT}`);
});
