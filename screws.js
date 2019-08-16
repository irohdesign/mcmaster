const puppeteer = require('puppeteer');
const $ = require('jquery');

var StrippedString;

function stripTags(toStrip) {
    StrippedString = toStrip.replace(/(<([^>]+)>)/ig," ");
    return StrippedString;
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.mcmaster.com/93235a074',  {waitUntil: 'networkidle2'});

  let bodyHandle;
//   for title
  bodyHandle = await page.$('h3.header-primary--pd');
  let title = await page.evaluate(body => body.innerHTML, bodyHandle);
  title = stripTags(title);

  let listing = {
    'name': title,
  };

  bodyHandle = await page.$('tbody');
  let table = await page.evaluate(body => body.innerHTML, bodyHandle);
  
table = table.split('</tr>');
let rowData = [];

table.forEach(function (row) {
    rowPieces = row.split('</td>');
    rowPieces.forEach(function (datapoint) {
        datapoint = stripTags(datapoint).trim();
        if (datapoint) {
            rowPieces = [];
            rowData.push(datapoint);
        }
    })
    console.log(rowPieces);
});



// console.log(listing);
// let newRowData = [];
// rowData.forEach(function(row) {
//     row.forEach(function (individual) {
//         individual = stripTags(individual).trim();
//         newRowData.push(individual);
//     });
// })
// console.log(newRowData);
// console.log(table);
//   table = stripTags(table).split('  ');
//   let qual = table[0].trim();
//   let detail = table[1].trim();

//     listing[qual] = detail;
//     console.log(listing);

// for table
// await page.goto('https://www.mcmaster.com/screws',  {waitUntil: 'networkidle2'});
// bodyHandle = await page.$('.GroupPrsnttn h3');

// let tableTitle = await page.evaluate(body => body.innerHTML, bodyHandle);


// bodyHandle = await page.$('.GroupPrsnttn');

//     let row = await page.evaluate(body => body.innerHTML, bodyHandle);
//   row = stripTags(row);

//   console.log(row);

  await browser.close();
})();