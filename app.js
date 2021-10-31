const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require("method-override");

const photoController = require('./controller/photoController');
const pageController = require('./controller/pageController');
const app = express();

mongoose.connect('mongodb://localhost/pcat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

app.use(function (req, res, next) {
  console.log('Request:', req.path);
  next();
});
app.set('view engine', 'ejs');


app.route("/")
    .get((req, res) => { photoController.getAllPhotos(req, res) })
;

app.route("/about")
    .get( (req, res) => { pageController.getAboutPage(req, res) })
;

app.route("/add")
    .get( (req, res) => { pageController.getAddPage(req, res) })
;

app.route("/photo")
    .post((req, res) => { photoController.createPhoto(req, res) })
;

app.route("/photo/:id")
    .get((req, res) => { photoController.getPhotoById(req, res) })

    .put((req, res) => { photoController.editPhoto(req, res) })
;

app.route("/photos/edit/:id")
    .get((req, res) => { pageController.getEditPage(req, res) })
;

app.route("/photos/delete/:id")
    .delete((req, res) => {photoController.deletePhoto(req, res) })
;


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda başlatıldı.`);
});