import puppeteer from "puppeteer";
import fs from "fs";

const weaponsSchema = async (weaponType) => {
	const url = `https://bg3.wiki/wiki/${weaponType}`;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	const weaponList = await page.evaluate(() => {
		const header = document.querySelectorAll("th");
		const rows = document.querySelectorAll("td");
		let rowCounter = 0;

		let schema = [];
		let schemaItem = {};

		const schemaKeys = Array.from(header)
			.splice(0, 7)
			.map((item) => {
				const text = item.innerText;
				return text;
			});

		const schemaValues = Array.from(rows).map((item) => {
			const text = item.innerText;
			return text;
		});

		for (i = 0; i < schemaValues.length; i++) {
			if (rowCounter === 7) {
				rowCounter = 0;
				schema.push(schemaItem);
				schemaItem = {};
			}
			schemaItem[schemaKeys[rowCounter]] = schemaValues[i];
			rowCounter++;
		}
		return schema;
	});

	return weaponList;
};

const greatswordData = weaponsSchema("Greatswords");

greatswordData.then((res) => {
	writeJsonFile("greatswords-schema", res);
});

const writeJsonFile = (fileName, data) => {
	const parsedData = JSON.stringify(data);
	console.log({ parsedData });
	fs.writeFile(`${fileName}.json`, parsedData, function (err) {
		if (err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});
};
