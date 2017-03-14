var express = require('express');
var mongo = require('mongodb');
var assert = require('assert');
var router = express.Router();
var dbUrl = 'yourMongodbAddress'; // Get Free MongoDB from mlab.com



router.get('/', function(req, res, next) {
  res.render('index', { title: 'hbs'} );
});

router.get('/dataList', function(req,res,next) {
    var resultArray = [];
    mongo.connect(dbUrl, function(err, db) {
      assert.equal(null,err);
      var cursor = db.collection('movies').find();
      cursor.forEach(function(doc, err) {
          assert.equal(null, err);
          resultArray.push(doc);
      }, function() {
            db.close();
            res.render('index', {items: resultArray});
      });
    });
});

router.post('/insert', function(req, res, next) {
    var movie = {
      Title: req.body.title,
      Year: req.body.year,
      Rated: req.body.rated,
      Released: req.body.released,
      Runtime: req.body.runtime,
      Genre: req.body.genre,
      Director: req.body.director,
      Writer: req.body.writer,
      Actors: req.body.actors,
      Plot: req.body.plot,
      Language: req.body.language,
      Country: req.body.country,
      Awards: req.body.awards
    };
    res.render('index');
    mongo.connect(dbUrl, function(err, db) {
      assert.equal(null, err);
      db.collection('movies').insertOne(movie, function(err, result) {
        assert.equal(null, err);
        console.log("İtem İnserted", movie);
        db.close();
      });
    });
});

router.post('/update', function(req, res, next) {
    var movie = {
      Title: req.body.title,
      Year: req.body.year,
      Rated: req.body.rated,
      Released: req.body.released,
      Runtime: req.body.runtime,
      Genre: req.body.genre,
      Director: req.body.director,
      Writer: req.body.writer,
      Actors: req.body.actors,
      Plot: req.body.plot,
      Language: req.body.language,
      Country: req.body.country,
      Awards: req.body.awards
    };
    var id = new mongo.ObjectId(req.body.movieID);

    mongo.connect(dbUrl, function(err, db) {
      assert.equal(null, err);
      db.collection('movies').updateOne({"_id": id}, {$set: movie}, function(err, result) {
        assert.equal(null, err);
        console.log(id, ' İtem update: ', movie);
        db.close();
        res.redirect('/dataList');
      });
    });
  });

router.post('/delete', function(req, res, next) {
    var id = new mongo.ObjectId(req.body.movieID);

    mongo.connect(dbUrl,function(err, db) {
      assert.equal(null,err);
      db.collection('movies').deleteOne({"_id": id}, function(err, result) {
        assert.equal(null, err);
        console.log(id, " Data is deleted");
        db.close();
        res.redirect('/dataList');
      });
    });
  });

  router.post('/clinet/submit', function(req, res) {
      var id = req.body.ID;
      res.redirect('/client/' + id);
  });

  router.get('/client/:id', function(req,res,next) {
      var id = new mongo.ObjectId(req.params.id);
      var resultArray = [];
      mongo.connect(dbUrl, function(err, db) {
        assert.equal(null,err);
        var cursor = db.collection('movies').find({"_id": id});
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
              db.close();
              res.render('index', {item: resultArray});
        });
      });
  });

/* GET users listing. */
router.get('/users/:user', function(req, res, next) {
  res.send('respond with a resource' + req.params.user);
});

router.get('/users/detail', function(req, res, next) {
  res.send('detail');
});


module.exports = router;
