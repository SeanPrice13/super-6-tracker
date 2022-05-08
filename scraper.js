const drawData = [];
// My First Node.js server with Express & NEDB!

const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const Datastore = require("nedb");
const app = express();
const database = new Datastore({ filename: "database.db", autoload: true });

app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.use(cors());

app.get("/api", async (req, res) => {
  try {
    // Scrape the NLA Super 6 data (Timed)
    console.time("scrapeTime");
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto("https://www.nla.gd/wp-json/wp/v2/pages/549");
    const el = await page.$eval("pre", (element) => element.textContent);
    browser.close();
    console.timeEnd("scrapeTime");
    formatRawNLAData(el);
    addDrawToDb();
    allDbDrawNumbers(res);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Running on port 5000.");
});

// app.post('/api', (req, res) => {
//     console.time('post2db');
//     console.log('I got a request!');
//     // console.log(req.body.drawData);
//     database.insert(req.body.drawData);
//     res.json(req.body.drawData[0].key);
//     console.timeEnd('post2db');
// });

const formatRawNLAData = (el) => {
  // Format the scraped data for use.
  const raw = JSON.parse(el)
    .content.rendered.slice(
      JSON.parse(el).content.rendered.indexOf("<table><thead>")
    )
    .toString()
    .replace(/(<([^>]+)>)/gi, "")
    .replace("DateWinning#LetterDraw ID", "")
    .replace(/[,-\s]/g, "");
  let dS1 = 0,
    dS2 = 8,
    nS2 = 20,
    lS2 = 21,
    iS2 = 25;
  for (let i = 0; i < 26; i++) {
    const drawDate = raw.slice(dS1, dS2);
    const drawNums = raw.slice(dS2, nS2).match(/.{1,2}/g);
    const drawLtr = raw.slice(nS2, lS2);
    const drawId = raw.slice(lS2, iS2);
    drawData.push({
      date: drawDate,
      draw: drawNums,
      letter: drawLtr,
      key: drawId,
    });
    dS1 += 25;
    dS2 += 25;
    nS2 += 25;
    lS2 += 25;
    iS2 += 25;
  }
};

const addDrawToDb = () => {
  // Check database for most recent draw & add to database if not found.
  for (let j = 0; j < drawData.length; j++) {
    const iD = drawData[j].key;
    database.findOne({ key: iD }, (err, output) => {
      if (err) {
        console.log(err);
      }
      if (output !== null) {
        if (output.key == iD) {
          console.log("EXISTS!", iD);
        }
      } else {
        console.log(output, iD);
        database.insert(drawData[j]);
        console.log("ADDED!", iD);
      }
    });
  }
};

const allDbDrawNumbers = (res) => {
  // Pull all draw numbers from database & send to client.
  const numbers = [];
  database.find({}, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (let k = 0; k < result.length; k++) {
      const draw = result[k];
      draw.draw.forEach((num) => {
        numbers.push(num);
      });
    }
    res.json(numbers);
  });
};
