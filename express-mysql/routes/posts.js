var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');

// Import database
var connection = require('../library/database');

// Set storage engine
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
var upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, 
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('gambar_buket');

function checkFileType(file, cb) {
    var filetypes = /jpeg|jpg|png|gif/;
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    var mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// INDEX POSTS
router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM posts ORDER BY id DESC', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts/index', { data: ''});
        } else {
            res.render('posts/index', { data: rows });
        }
    });
});

// CREATE POST
router.get('/create', function (req, res, next) {
    res.render('posts/create', {
        gambar_buket: '',
        nama_buket: '',
        harga: ''
    });
});

// STORE POST
router.post('/store', function (req, res, next) {
    upload(req, res, function (err) {
        console.log('Multer Error:', err);
        console.log('File:', req.file);
        console.log('Body:', req.body);
        
        if (err) {
            req.flash('error', 'Error uploading file.');
            console.error('Upload Error:', err);
            return res.redirect('/posts/create');
        }
        
        if (!req.file) {
            req.flash('error', 'Silakan masukkan gambar_buket');
            console.error('File not found in request');
            return res.redirect('/posts/create');
        }

        var gambar_buket = req.file.filename;
        var { nama_buket, harga } = req.body;

        if(!nama_buket || !harga || !gambar_buket) {
            req.flash('error', 'Silakan lengkapi semua kolom');
            console.error('Validation Error:', { nama_buket, harga, gambar_buket });
            return res.redirect('/posts/create');
        }

        var formData = { gambar_buket, nama_buket, harga };
        connection.query('INSERT INTO posts SET ?', formData, function(err, result) {
            if (err) {
                req.flash('error', 'Gagal menyimpan data. Silakan coba lagi.');
                console.error('Database Error:', err);
                return res.redirect('/posts/create');
            } else {
                req.flash('success', 'Data berhasil disimpan!');
                return res.redirect('/posts');
            }
        });
    });
});

// EDIT POST
router.get('/edit/(:id)', function(req, res, next) {
    let id = req.params.id;
   
    connection.query('SELECT * FROM posts WHERE id = ?', [id], function(err, rows, fields) {
        if(err) throw err;

        if (rows.length <= 0) {
            req.flash('error', 'Data Post Dengan ID ' + id + ' Tidak Ditemukan');
            return res.redirect('/posts');
        } else {
            res.render('posts/edit', {
                id: rows[0].id,
                gambar_buket: rows[0].gambar_buket,
                nama_buket: rows[0].nama_buket,
                harga: rows[0].harga
            });
        }
    });
});

// UPDATE POST
router.post('/update/:id', function (req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            req.flash('error', 'Error uploading file.');
            console.error('Upload Error:', err);
            return res.redirect('/posts/edit/' + req.params.id);
        }

        let id = req.params.id;
        let nama_buket = req.body.nama_buket;
        let harga = req.body.harga;
        let old_gambar_buket = req.body.old_gambar_buket;
        let gambar_buket = req.file ? req.file.filename : old_gambar_buket;
        let errors = false;

        console.log('Nama Buket:', nama_buket);
        console.log('Harga:', harga);
        console.log('Old Gambar Buket:', old_gambar_buket);
        console.log('Gambar Buket:', gambar_buket);

        if (!nama_buket) {
            errors = true;
            req.flash('error', "Silahkan Masukkan Nama Buket");
        }

        if (!harga) {
            errors = true;
            req.flash('error', "Silahkan Masukkan Harga");
        }

        if (errors) {
            return res.render('posts/edit', {
                id: id,
                nama_buket: nama_buket,
                harga: harga,
                gambar_buket: old_gambar_buket
            });
        }

        let formData = {
            gambar_buket: gambar_buket,
            nama_buket: nama_buket,
            harga: harga
        };

        connection.query('UPDATE posts SET ? WHERE id = ?', [formData, id], function(err, result) {
            if (err) {
                req.flash('error', err);
                return res.render('posts/edit', {
                    id: id,
                    nama_buket: nama_buket,
                    harga: harga,
                    gambar_buket: old_gambar_buket 
                });
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                return res.redirect('/posts');
            }
        });
    });
});

// DELETE POST


module.exports = router;
