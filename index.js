const puppeteer = require("puppeteer");
const express = require("express");

const app = express();

app.get("/pdf", async function(req, res) {
    console.log(`Request for /pdf with URL: '${req.query.url}'`);
    let browser = await puppeteer.launch({args: ['--no-sandbox']});
    let page = await browser.newPage();
    await page.goto(req.query.url, {waitUntil: 'networkidle'});

    let dimensions = await page.evaluate(() => {
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        }
    });

    let pdf = await page.pdf({
        printBackground: true,
        // path: "preview_02.pdf",
        pageRanges: "1",
        width: dimensions.width,
        height: dimensions.height
    });

    browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.write(pdf, 'binary');
    res.end(null, 'binary');
});

app.get("/image", async function(req, res) {
    console.log(`Request for /image with URL: '${req.query.url}'`);
    let browser = await puppeteer.launch({args: ['--no-sandbox']});
    let page = await browser.newPage();
    await page.goto(req.query.url, {waitUntil: 'networkidle'});

    let image = await page.screenshot({fullPage: true});

    browser.close();

    res.setHeader("Content-Type", "image/png");
    res.write(image, 'binary');
    res.end(null, 'binary');
});

app.listen(3000, () => console.log("App listening on port 3000"));
