//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
const postSchema = {
  title: String,
  content: String,
};
const Post = new mongoose.model("Post", postSchema);
const homeStartingContent =
  "Welcome to our fitness blog, your ultimate destination for all things health and wellness! Here, you'll find a wide array of informative and inspiring posts designed to help you on your fitness journey. Our dedicated team of fitness enthusiasts and experts are passionate about sharing valuable insights, tips, and strategies to help you achieve your fitness goals and lead a healthier lifestyle. Whether you're a beginner looking for guidance on starting a workout routine, an experienced athlete seeking advanced training techniques, or simply seeking motivation and inspiration, our blog is here to provide you with a wealth of knowledge. From workout routines and nutrition tips to mindfulness practices and success stories, we've got you covered. Get ready to embark on a transformative journey with us as we explore the many facets of fitness and empower you to live your best, most vibrant life. Stay tuned for regular updates as we continue to bring you the latest and greatest in the world of fitness. Let's embark on this fitness adventure together!";
const aboutContent =
  "Welcome to our fitness blog! We are a passionate team of health and wellness enthusiasts dedicated to helping you transform your life through fitness. Our mission is to provide you with valuable information, practical tips, and inspiration to support your fitness journey.At our blog, you'll find a wide range of content tailored to meet your fitness needs. Whether you're a beginner taking your first steps towards a healthier lifestyle or a seasoned fitness enthusiast looking for new challenges, we've got something for everyone.Our team of experts covers a diverse range of topics, including workout routines, nutrition guidance, weight loss strategies, strength training, cardio exercises, flexibility and mobility, mindfulness and mental health, and much more. We strive to provide evidence-based information to help you make informed decisions and achieve sustainable results.We believe that fitness is not just about physical strength but also about overall well-being. That's why we emphasize the importance of a holistic approach to health, incorporating aspects such as proper nutrition, stress management, and self-care practices.Join us on this fitness journey as we share our knowledge, experiences, and practical advice to inspire and motivate you along the way. We are committed to creating a supportive community where you can connect with like-minded individuals, share your progress, and find the encouragement you need to reach your fitness goals.Whether you're looking to lose weight, gain muscle, improve your athletic performance, or simply adopt a healthier lifestyle, our blog is here to guide and empower you. Together, let's strive for a stronger, fitter, and happier version of ourselves. Let's make fitness a lifelong pursuit and discover the incredible potential within us.";
const contactContent =
  "We would love to hear from you! If you have any questions, feedback, or suggestions, please don't hesitate to get in touch with us. We value your input and are committed to providing the best possible experience for our readers.You can reach us through the following channels:Email: tkalalian@getDefaultMiddleware.comPhone: +961 70 539 108Social Media: Find us on Facebook, Twitter, and InstagramFeel free to reach out to us with your inquiries or to share your success stories and fitness achievements. We're here to support and celebrate your progress every step of the way.Thank you for being a part of our fitness community, and we look forward to connecting with you soon!";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({})
    .then((posts) => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId })
    .then((post) => {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
