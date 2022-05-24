// My First Node.js server with Express & NEDB!
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const Datastore = require("nedb");
const database = new Datastore({ filename: "database.db", autoload: true });

app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.use(cors());

// Scrape the NLA Super 6 data and add to database.
app.get("/scrape", async (req, res) => {
  try {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto("https://www.nla.gd/wp-json/wp/v2/pages/549");
    const el = await page.$eval("pre", (element) => element.textContent);
    browser.close();
    formatRawNLAData(el);
    res.json('Done. Refresh Page.');
  } catch (e) {
    res.status(500).send(e);
  }
});

// Pull draws within requested date from database & send to client.
app.post('/api', (req, res) => {
  const draws = [];
  database.find({$and: [{date: {$gte: req.body.fromDate}}, {date: {$lte: req.body.toDate}}]}, (err, result) => {
    if (err) console.log(err);
    for (let i = 0; i < result.length; i++) {
      const draw = result[i];
      draws.push(draw);
    }
    res.json(draws);
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Running on port 5000.");
});

/***************************************FUNCTIONS***************************************/
// Format the scraped data into individual draws and push to drawData array.
function formatRawNLAData(rawScrapedData) {
  const drawData = [];
  const rawFilteredData = JSON.parse(rawScrapedData).content.rendered.slice(JSON.parse(rawScrapedData).content.rendered.indexOf("<table><thead>")).toString().replace(/(<([^>]+)>)/gi, "").replace("DateWinning#LetterDraw ID", "").replace(/[,-\s]/g, "");
  let dS1 = 0, dS2 = 8, nS2 = 20, lS2 = 21, iS2 = 25;
  for (let i = 0; i < rawFilteredData.length / 25; i++) {
    drawData.push({date: rawFilteredData.slice(dS1, dS2), draw: rawFilteredData.slice(dS2, nS2).match(/.{1,2}/g), letter: rawFilteredData.slice(nS2, lS2), key: rawFilteredData.slice(lS2, iS2)});
    dS1 += 25;
    dS2 += 25;
    nS2 += 25;
    lS2 += 25;
    iS2 += 25;
  }
  addDrawToDb(drawData);
};

// Check database for each recent draw & add to database if not found.
function addDrawToDb(drawArr) {
  for (let i = 0; i < drawArr.length; i++) {
    const iD = drawArr[i].key;
    database.findOne({ key: iD }, (err, output) => {
      if (err) console.log(err);
      output !== null ?
        (output.key == iD ? console.log("EXISTS!", iD) : console.log()) :
        (console.log(output, iD), database.insert(drawArr[i]), console.log("ADDED!", iD));
    });
  }
};