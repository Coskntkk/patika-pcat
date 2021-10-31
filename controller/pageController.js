const Photo = require("../model/Photo");

exports.getAboutPage = (req, res) => {
    res.render("about");
}

exports.getAddPage = (req, res) => {
    res.render("add");
}

exports.getEditPage = (req, res) => {
    Photo.findById(req.params.id, (err, foundPhoto) => {
        if (!err) {
            res.render("edit", {photo: foundPhoto});
        }
    });
}