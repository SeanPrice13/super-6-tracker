// My First Node.js server with Express & MongoDB!(Mongoose)
require('dotenv').config();
const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const cors = require("cors");
const mongoose = require('mongoose');
const Draw = require('./models/draw');
const Combination = require('./models/combination');

// Connect to MongoDB database using mongoose. 
mongoose.connect(process.env.DATABASE_URL).then((result) => app.listen(process.env.PORT || 5000, () => { console.log("DB Running on port 5000.") })).catch((err) => console.log(err));

// Middleware
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.use(cors());

// Scrape the NLA Super 6 data and format the data to pass to database.
app.get("/scrape", async (req, res) => {
  try {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(process.env.NLA_SUPER6);
    const el = await page.$eval("pre", (element) => element.textContent);
    browser.close();
    // Format the scraped data into individual draws and push to scrapedDraws array.
    const scrapedDraws = [];
    const rawFilteredData = JSON.parse(el).content.rendered.slice(JSON.parse(el).content.rendered.indexOf("<table><thead>")).toString().replace(/(<([^>]+)>)/gi, "").replace("DateWinning#LetterDraw ID", "").replace(/[,-\s]/g, "").match(/.{1,25}/g);
    rawFilteredData.map((drawRow) => {
      scrapedDraws.push({
        date: drawRow.slice(0, 8),
        draw: drawRow.slice(8, 20).match(/.{1,2}/g),
        letter: drawRow.slice(20, 21),
        key: drawRow.slice(21, 25),
      });
    });
    // Check database for each recent draw & add to database if not found.
    scrapedDraws.map((scrapedDraw) => {
      Draw.findOne({ key: scrapedDraw.key }, (err, output) => {
        output !== null ?
          (output.key == scrapedDraw.key ? console.log("EXISTS!", scrapedDraw.key) : console.log()) :
          (console.log(output, scrapedDraw.key), Draw.create(scrapedDraws), console.log("ADDED!", scrapedDraw.key));
      });
    });
    res.json("Task Completed.");
  } catch (e) {
    res.status(500).send(e);
  }
});

// Pull draws within requested date from database & send to client.
app.post('/api', (req, res) => {
  Draw.find({$and: [{date: {$gte: req.body.fromDate}}, {date: {$lte: req.body.toDate}}]}, (err, result) => {
    res.json(result);
  });
});

// Pull combinations from database & send to client.
app.post('/api/combos', async (req, res) => {
  const recom = [];
  result = Combination.aggregate([{$match: {combo: {$all: req.body.aThreshold}}}, {$sample: {size: 15}},]);
  for await (const doc of result) {
  recom.push(doc.combo);
  }
  res.json(recom);
});

/***************************************TEST CODE***************************************/