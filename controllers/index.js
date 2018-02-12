var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var db = require("../models");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo-cheerio";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});


/* GET for Home Page*/
router.get('/', function(req, res, next) {
    db.Article.find({}).limit(20).sort({date: -1})
    .then(function(dbArticles) {
      res.render('index', {dbArticles});
    })
    .catch(function(err) {
      res.json(err);
    });
});
// POST for Home Page
router.post('/', function(req ,res){
  db.Article.update({_id: req.body.articleID},{saved: true})
  .then(function(){
    res.redirect('/')
  })
});


router.get("/saved", function(req, res){
  db.Article.find({})
  .then(function(dbArticles){
    res.render('saved', {dbArticles})
  })
  .catch(function(err) {
    res.json(err);
  })
});

router.post("/saved", function(req, res){
  db.Article.remove({_id: req.body.articleID})
  .then(function(){
    res.redirect('/saved');
  })
})

// SCRAPE NYT AND ADD TO DB
router.get("/scrape", function(req, res) {
	request("https://www.nytimes.com/section/technology?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Tech&WT.nav=page", function(error, response, html) {
    var $ = cheerio.load(html);
    var responseCounter = 10;
    if (error) {
      console.log(error);
      res.send("Scrape Failed");
    }
	 	$("a.story-link").each(function(i, element) {
	  		var link = $(element).attr("href");
	    	var summary = $(element).find("p.summary").text();
        var title = $(element).find("h2.headline").text();
        var addArticle = {
		      title: title,
		      summary: summary,
		      link: link
        }
        db.Article.create(addArticle)
        .then(function(returnArticles){
          console.log("added article");
        })
        .catch(function(err){
          res.json(err);
        })
	  	});
    res.redirect("/");
	});
})

// ROUTE TO VISIT ARTICLE
router.route("/saved/:id")
.get(function(req, res){
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
})
.post(function(req, res){
    // console.log(req.params)
    var addComment = {
        comment: req.body.newNote
    };
    db.Notes.create(addComment)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // res.json(dbArticle);
      res.redirect('/saved');
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.post('/note/:id', function(req ,res){

  db.Notes.remove({_id: req.body.noteDeleteID})
  .then(function(){
    console.log("Note Deleted")
  })
  .then(function(){
    res.redirect('/saved');
  })
  .catch(function(err) {
    res.json(err);
  });
});


module.exports = router;
  