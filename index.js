import puppeteer from "puppeteer";

const url = "https://www.joshwcomeau.com/";

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

	const allArticles = await page.evaluate(() => {
		const articles = document.querySelectorAll("article");

		return Array.from(articles).map((item) => {
			const title = item.querySelector("h3").innerText;
			const url = item.querySelector("a").href;
			return { title, url };
		});
	});
	console.log(allArticles);
};

main();
