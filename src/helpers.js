export const writeJsonFile = (fileName, data) => {
	const parsedData = JSON.stringify(data, null, 2);
	fs.writeFile(`${fileName}.json`, parsedData, function (err) {
		if (err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});
};

export const cleanValuesCommas = (arr) => {
	return arr.map((item) => {
		return item.trim();
	});
};
