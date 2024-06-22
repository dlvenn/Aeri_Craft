var express = require('express');
var router = express.Router();

var connection = require('../library/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM posts ORDER BY id DESC', function (err, rows) {
    if (err) {
        req.flash('error', err);
        //res.render('posts/index', { data: ''});
        res.render('index', { title: 'Express',  data: '' });
    } else {
        res.render('index', { title: 'Express',  data: rows });
        //res.render('posts/index', { data: rows });
    }
  });
  //res.render('index', { title: 'Express' });
});

router.get('/indexUser', (req,res) => {
  res.render('indexUser');
});

router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;
