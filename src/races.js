import puppeteer from "puppeteer";
import { writeJsonFile, cleanValuesCommas } from "./helpers.js";
import fs from "fs";

const racesTypes = async () => {
	let browser = null;

	try {
		browser = await puppeteer.launch();
		const url = `https://bg3.wiki/wiki/Proficiency`;
		const page = await browser.newPage();
		await page.goto(url);
		let schema = [];

		const raceHeader = await page.evaluate(() => {
			const raceTableData = document.querySelectorAll("table.wikitable tr");
			const raceTableCell = Array.from(raceTableData).map((item, idx) => {
				if (idx >= 1 && idx !== 6 && idx < 14) {
					return item.innerText;
				}
			});
			return raceTableCell;
		});

		const filteredList = raceHeader.filter((item, idx) => {
			if (idx >= 1 && idx !== 6 && idx < 14) {
				return item + idx;
			}
		});

		const dividedList = filteredList.map((item) => {
			return item.split("\t");
		});

		const formatArrToObject = dividedList.map((item) => {
			const key = item[0];
			let value = cleanValuesCommas(item[1].split(","));

			return {
				[key]: value,
			};
		});

		return formatArrToObject;
	} catch (e) {
		console.log("error:", e);
	} finally {
		await browser.close();
	}
};

// const raceSchemas = async (raceType) => {
// 	const url = `https://bg3.wiki/wiki/Proficiency`;
// 	const browser = await puppeteer.launch();
// 	const page = await browser.newPage();
// 	await page.goto(url);

// 	// !!! get only weapon proficiency of each race !!!

// 	const raceData = await page.evaluate(() => {
// 		const tableData = document.querySelectorAll("ul");
// 		const cellData = Array.from(tableData).map((item) => {
// 			if (item.innerText.includes("Proficiency")) {
// 				return item.innerText;
// 			}
// 		});
// 		return cellData;
// 	});

// 	return raceData;
// };

const typesOfRaces = racesTypes();

typesOfRaces.then((res) => {
	console.log(res);
	// res.map((element) => {
	// 	const slug = element.replace(/ /g, "_");
	// 	const race = raceSchemas(slug);
	// 	race.then((raceRes) => {
	// 		console.log(raceRes[1]);
	// 		// writeJsonFile(`./schemas/races/${slug}`, raceRes);
	// 	});
	// });
});
