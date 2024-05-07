import puppeteer from "puppeteer";

const url = "https://bg3.wiki/wiki/Greatswords";

// const main = async () => {
// 	const browser = await puppeteer.launch();
// 	const page = await browser.newPage();
// 	await page.goto(url);
// 	await page.screenshot({ path: "screenshot.png" });
// 	await browser.close();
// };

const main = async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	const allRows = await page.evaluate(() => {
		const rowItem = document.querySelectorAll("tr");

		return Array.from(rowItem).map((item) => {
			const text = item.innerText;
			// const url = item.href;
			return { text };
		});
	});
	console.log(allRows);
};

main();
