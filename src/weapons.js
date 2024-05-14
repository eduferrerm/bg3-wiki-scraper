import puppeteer from "puppeteer";
import { writeJsonFile } from "./helpers.js";
import fs from "fs";

const weaponTypes = async () => {
	const url = `https://bg3.wiki/wiki/Weapons`;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);
	// browser.close();

	const weaponList = await page.evaluate(() => {
		const tableData = document.querySelectorAll("table.wikitable tr td li a");
		const weapons = Array.from(tableData).map((item) => {
			return item.innerText;
		});
		return weapons;
	});
	return weaponList.filter((item) => item.length > 0);
};

const weaponsSchema = async (weaponType) => {
	const url = `https://bg3.wiki/wiki/${weaponType}`;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	const weaponList = await page.evaluate((weaponType) => {
		const header = document.querySelectorAll("th");
		const rows = document.querySelectorAll("td");
		const schema = [];
		let rowCounter = 0;
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
			const type = weaponType;
			const value = schemaValues[i]
				.replace(/(\r\n|\n|\r)/gm, " ")
				.replace(/\s+/g, " ");

			if (rowCounter === 7) {
				const slug = schemaItem["weapon"].replace(/ /g, "_");
				schemaItem["found"] = `https://bg3.wiki/wiki/${slug}#Where_to_find`;
				schema.push(schemaItem);
				rowCounter = 0;
				schemaItem = {};
			}
			if (rowCounter === 0) {
				schemaItem["type"] = `${type}`;
			}
			schemaItem[schemaKeys[rowCounter].toLowerCase()] = value;
			rowCounter++;
		}
		return schema;
	}, weaponType);

	return weaponList;
};

const typesOfWeapons = weaponTypes();

typesOfWeapons.then((res) => {
	res.map((element) => {
		const slug = element.replace(/ /g, "_");
		const weapon = weaponsSchema(slug);
		weapon.then((weaponRes) => {
			writeJsonFile(`./schemas/weapons/${slug}`, weaponRes);
		});
	});
});
