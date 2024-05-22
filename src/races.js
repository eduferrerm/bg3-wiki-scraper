import puppeteer from "puppeteer";
import { writeJsonFile, trimStringArr } from "./helpers.js";

const raceProficienciesTypes = async () => {
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

		const formatArrToObject = () => {
			let cleanObjectsArr = [];
			let stackedObjectsArr = [];

			dividedList.map((item) => {
				const key = item[0];
				let value = trimStringArr(item[1].split(","));

				if (key.includes(",")) {
					const stackedKey = key.split(",");

					stackedKey.map((stackedKeyItem) => {
						stackedObjectsArr.push({
							[stackedKeyItem.trim()]: value,
						});
					});
				} else {
					cleanObjectsArr.push({
						[key]: value,
					});
				}
			});

			return cleanObjectsArr.concat(stackedObjectsArr);
		};

		return formatArrToObject();
	} catch (e) {
		console.log("error:", e);
	} finally {
		await browser.close();
	}
};

const weaponProficiencies = raceProficienciesTypes();

weaponProficiencies.then((res) => {
	writeJsonFile(`./schemas/race-proficiencies/race-proficiencies`, res);
});
