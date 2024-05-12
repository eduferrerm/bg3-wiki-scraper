import puppeteer from "puppeteer";
import { writeJsonFile } from "./helpers.js";
import fs from "fs";

const racesTypes = async () => {
	const url = `https://bg3.wiki/wiki/Weapons`;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	let nonStackedElements = [];
	let stackedElements = [];
	let cleanSingleEntries = [];
	let cleanStackedEntries = [];

	const raceList = await page.evaluate(() => {
		const raceTableData = document.querySelectorAll("table.wikitable tr th");
		const raceTableCell = Array.from(raceTableData).map((item, idx) => {
			return item.innerText;
		});
		return raceTableCell;
	});

	const filteredList = raceList.filter((item, idx) => {
		if (idx >= 19 && idx !== 24 && idx < 31) {
			return item;
		}
	});

	filteredList.map((item) => {
		if (item.indexOf(", ") > -1) {
			stackedElements.push(item);
		} else {
			nonStackedElements.push(item.split(","));
		}
	});

	nonStackedElements = nonStackedElements.map((item) => {
		cleanSingleEntries = [...cleanSingleEntries, ...item];
	});

	stackedElements = stackedElements.map((item) => {
		cleanStackedEntries = [...cleanStackedEntries, ...item.split(",")];
	});

	return cleanSingleEntries.concat(cleanStackedEntries);
};

// const raceSchemas = async (raceType) => {
// 	const url = `https://bg3.wiki/wiki/${raceType}`;
// 	const browser = await puppeteer.launch();
// 	const page = await browser.newPage();
// 	await page.goto(url);

// 	const raceData = await page.evaluate(() => {
// 		const tableData = document.querySelectorAll("ul ul li a");
// 		const cellData = Array.from(tableData).map((item) => {
// 			return item.innerText;
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
	// 		console.log(raceRes);
	// 		// writeJsonFile(`./schemas/races/${slug}`, raceRes);
	// 	});
	// });
});
