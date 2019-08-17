const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.mcmaster.com/93734a120', {waitUntil: 'networkidle2'});

  // const bodyHandle = await page.$('body');
  // const html = await page.evaluate(body => body.textContent, bodyHandle);
  // await bodyHandle.dispose();

  // console.log(html);
  let table = await page.evaluate(() => 
  Array.from(document
    .querySelectorAll('.spec-table--pd tbody'))
    .map(partner => partner.innerHTML)
    );

  table = table[0];

  newTable = table.split('</tr>');
  // console.log(newTable);

  // if row has multiple children
  let children = [];
  let valueArr = [];
  let obj = {};
  let title;
  let titleArr = [];
  let value;
  let valueStorage = [];
  let weirdValue;
  let objArr = [];

  newTable.forEach(function (row) {
    if ((row.includes('child-attr--table')) || (row.includes('grouped-row--table'))) {
      let newRow = row.split('</td>');
      // valueArr = [];

      newRow.forEach(function (item) {
        if (item.includes('<tr')) {
          let datapoint = item.split('>');
          datapoint = datapoint[2].trim();
          children.push(datapoint);
        } else if (item.includes('<td')) {
          let value = item.split('>');
          value = value[1];
          valueArr.push(value);
        }
      })
      children.forEach(function (instance, index) {
        obj[instance] = valueArr[index];
      })
    } else {
      let rows = row.split('<tr');
      rows.forEach(function (row) {
        let data = row.split('<td>');
        data.forEach(function (instance) {
          if (instance.includes('row--spec-tbl')) {
            let content = instance.split('</td>');
            content.forEach(function (line) {
              if (line.includes('row--spec-tbl')) {
                title = line.split('>');
                title = title[2].trim();
                titleArr.push(title);

              } else if (line.includes('value-cell--table')) {
                value = line.split('<td');

                value.forEach(function (search) {
                  if (search.includes('span')) {
                    let span = search.split('>');
                    span = span[2];
                    value = span.split('<');
                    value = value[0];
                    weirdValue = value;
                  }
                });

                value = value[1];
                value = value.split('>');
                value = value[1];
                valueStorage.push(value);
              }
            })
          }
        })
      })
    }
  })
  // console.log(titleArr.length);
  // console.log(valueStorage.length);

  titleArr.forEach(function (title, index) {
    obj = {};
    obj[title] = valueStorage[index];
    objArr.push(obj);
  })
  console.log(objArr);

  // table.forEach(function (row) {
  //   let data = row.split('</td>');
  //   let itemArr = [];
  //   let title, value;
  //   let obj = {};

  //   data.forEach(function(item) {
  //     if (item.includes('attr-cell--table')) {
  //       title = item.split('>').pop();
  //     } else if (item.includes('value-cell--table')) {
  //       value = item.split('>').pop();
  //     }
  //   })
  //   obj[title] = value;
  //   objArr.push(obj);
  // })
  // console.log(objArr);

  const categories = await page.evaluate(() => 
    Array.from(document
      .querySelectorAll('.attr-cell--table'))
      .map(partner => partner.innerText.trim())
      );

    const values = await page.evaluate(() => 
    Array.from(document
      .querySelectorAll('.value-cell--table'))
      .map(partner => partner.innerText.trim())
      );

    // console.log(categories);
    // console.log(table);
  await browser.close();
})();