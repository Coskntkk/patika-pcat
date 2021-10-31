const Photo = require("../model/Photo");
const fs = require("fs");

exports.createPhoto = (req, res) => {
    const uploadDir = './public/uploads'

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
    }

    let uploadImage = req.files.image
    let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name

    uploadImage.mv(uploadPath, async () => {
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadImage.name
        }),
        res.redirect('/')
    });
};

exports.getAllPhotos = (req, res) => {
    Photo.find({}, (err, foundPhotos) => {
        if ( !err ) {
            const currentPage = req.query.page || 1;
            const photosPerPages = 3;

            Photo.find({}).skip((currentPage -1) * photosPerPages).limit(photosPerPages).exec((err, foundPhotos2) => {

                if (!err ) {
                    res.render("index", { 
                        photos: foundPhotos2,
                        pages: Math.ceil(foundPhotos.length / 3),
                        currentPage: currentPage,
                    });
                }   else {
                    console.log(err);
                }
            });
        }
    });    
};

exports.getPhotoById = (req, res) => {
    Photo.findById( req.params.id, (err, foundPhoto) => {
        if ( !err ) {
            res.render("photo", {photo: foundPhoto})
        }
    });
};

exports.editPhoto = (req, res) => {
    Photo.findById( req.params.id, (err, foundPhoto) => {
        if ( !err ) {
            foundPhoto.title = req.body.title;
            foundPhoto.description = req.body.description;
            foundPhoto.save();

            res.redirect(`/photo/${req.params.id}`);
        }
    });
};

exports.deletePhoto = (req, res) => {
    Photo.findById( req.params.id, (err, foundPhoto) => {
        if ( !err ) {
            let deletePath = __dirname + "/../public" + foundPhoto.image;
            fs.unlinkSync(deletePath);
            Photo.findByIdAndRemove(req.params.id, (err) => {
                res.redirect("/");
            });
        }
    });
};