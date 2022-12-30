/********************************\
 * **************************** *
 * This file contain functions 	*
 * About userSeries.volume_list	*
 * **************************** *
\********************************/

/**
 * Fonction that check if input in in a volume_list
 * 
 * @param {String} input 
 * @param {String} userVolume_list format volume_list
 *
 * @returns {Boolean}
 */
function contains (input, userVolume_list) {
	const parts = userVolume_list.split(",");

	for (const part of parts) {
		if (part.startsWith("[")) {
			const [start, end] = part.slice(1,-1).split("-");
			if (input >= start && input <= end) {
				return true;
			}
		} else {
			if (input == part) {
				return true;
			}
		}
	}
	return false
}

/**
 * Check if str is a correct volume_list string.
 * 
 * Every part should be greater than previous one.
 * Every part should respect [x-y] ou x where x and y are decimal numbers and x < y.
 * @param {String} str 
 * 
 * @returns {Boolean}
 */
function isCorrect (str) {
	if (str == "") {
		return true;
	}
	const reg = /^((\[\d+-\d+\])|(\d+))(,((\[\d+-\d+\])|(\d+)))*$/ig;

	if ((reg).test(str)) {
		const parts = str.split(",");
		let currentGreater = -2; // In case serie starts by volume 0 cpt = -2.
		for (const part of parts) {
			if (part.startsWith("[")) { // check for [x-y] format
				const [start, end] = part.slice(1,-1).split("-").map(val=>parseInt(val));
				if (!start || ! end || end <= start || currentGreater >= end || start - currentGreater < 2) {
					return false;
				}
				currentGreater = end;
			} else { // check for x format
				if (currentGreater >= part || part - currentGreater < 2) {
					return false;
				}
				currentGreater = parseInt(part);
			}
		}
		return true;
	}
	return false
}

/**
 * Insert a volume number in a volume_list splited un parts at part i.
 * 
 * @param {String} val value to insert
 * @param {Array<String>} parts array of volume_list parts
 * @param {Integer} i pos of the part
 * 
 * @returns {Array<String>} parts modified
 */
function insertToPart(val, parts, i) {
	if (parts[i].startsWith("[")) { // case part folow format : [x-y]
		const [start, end] = parts[i].slice(1,-1).split("-").map(val => parseInt(val));

		// val is a new max or min -> replace previous bound by val
		// val is inside bounds -> nothing apprend
		// otherwise -> create a new part in parts
		if (val == start - 1) {
			parts[i] = `[${val}-${end}]`;
		} else if (val < start) {
			parts.splice(i, 0, val);
		} else if (val == end + 1) {
			parts[i] = `[${start}-${val}]`;
		} else if (val > end) {
			parts.splice(i+1, 0, val);
		}
	} else { // case part folow format : x

		// abs(part-val) = 1 -> transform part to [x-y] format
		// abs(part-val) = 0 -> nothign append
		// otherwise -> create a new part in parts
		parts[i] = parseInt(parts[i]);
		if (val == parts[i] - 1) {
			parts[i] = `[${val}-${parts[i]}]`;
		} else if (val < parts[i]) {
			parts.splice(i, 0, val);
		} else if (val == parts[i] + 1) {
			parts[i] = `[${parts[i]}-${val}]`;
		} else if (val > parts[i]) {
			parts.splice(i+1, 0, val);
		}
	}
	parts = parts.map(elem => elem.toString());
	
	return parts;
}

/**
 * Fonction that concat two parts i and j if needed.
 * 
 * @param {Array<String>} parts arrays of volume_list parts
 * @param {Integer} i index of first part
 * @param {Integer} j index of second part
 * 
 * @returns {Array<String>} parts modified
 */
function concat2Parts(parts, i, j) {
	const leftPart = parts[i];
	const rightPart = parts[j];

	if (leftPart.startsWith("[")) {
		const [leftStart, leftEnd] = leftPart.slice(1,-1).split("-").map(val => parseInt(val));

		if (rightPart.startsWith("[")) {
			const [rightStart, rightEnd] = rightPart.slice(1,-1).split("-").map(val => parseInt(val));

			if (rightStart - leftEnd < 2) {
				parts[i] = `[${Math.min(leftStart, rightStart)}-${Math.max(leftEnd, rightEnd)}]`;
				parts.splice(j,1);
			}
		} else {
			const right = parseInt(rightPart);

			if (right <= leftEnd + 1 && right >= leftStart - 1) {
				parts[i] =`[${Math.min(leftStart, right)}-${Math.max(leftEnd, right)}]`;
				parts.splice(j,1);
			}
		}
	} else {
		const left = parseInt(leftPart);
		
		if (rightPart.startsWith("[")) {
			const [rightStart, rightEnd] = rightPart.slice(1,-1).split("-").map(val => parseInt(val));

			if (left <= rightEnd + 1 && left >= rightStart - 1) {
				parts[i] =`[${Math.min(left, rightStart)}-${Math.max(left, rightEnd)}]`;
				parts.splice(j,1);
			}

		} else {
			const right = parseInt(rightPart);
			const difference = Math.abs(left - right);
			if (difference == 0) {
				parts.splice(j,1);
			} else if (difference == 1) {
				parts[i] = `[${Math.min(left, right)}-${Math.max(left, right)}]`;
				parts.splice(j,1);
			}
		}
	}
	return parts;
}

/**
 * Function that insert a volume into a volume_list.
 * 
 * @param {String} val volume to insert
 * @param {String} volume_list volume_list
 * 
 * @returns {String} volume_list modified
 */
function insertVolume(toAdd, volume_list) {
	if (!volume_list || volume_list == "") {
		return `${toAdd}`
	}

	let parts = volume_list.split(",");
	let i = -1;
	let res = true;
	let min = parseInt(toAdd.startsWith("[") ?  toAdd.split("-")[0].slice(1) : toAdd);

	while (res && ++i < parts.length) {
		const part = parts[i];

		if (part.startsWith("[")) {
			const end = parseInt(part.slice(1,-1).split("-")[1]);

			res = min > end;
		} else {
			res = min > parseInt(part);
		}
	}
	parts.splice(i, 0, toAdd);
	while (i < parts.length - 1 && parts.length != (parts = concat2Parts(parts, i, i+1)).length); // concat right
	while (i > 0 && parts.length > i && parts.length != (parts = concat2Parts(parts, i-1, i--)).length); // concat left
	
	return(parts.join(","))
}


/**
 * Count total volumes that are presents in a volume_list
 * 
 * @param {String} volume_list
 * 
 * @returns {Integer}
 */
function countTotalVolume(volume_list) {
	if (!volume_list || volume_list.length == 0)
		return 0;

	const parts = volume_list.replace(/\[|\]/ig, "").split(/,/ig).map(val => val.split("-"));
	let count = 0;

	for (const part of parts) {
		if (part.length > 1) {
			count += part[1] - part[0] + 1;
		} else {
			count++;
		}
	}
	return count;
}

function findFirstMissing(volume_list) {
	let lastVolume = 0;
	const parts = volume_list.replace(/\[|\]/ig, "").split(/,/ig).map(val => val.split("-"));
	
	for (const part of parts) {
		if (part[0] > lastVolume + 1) {
			return part[0];
		}

		lastVolume = parseInt(part[part.length < 2 ? 0 : 1]);
	}
	return (lastVolume + 1)
}

function compare(firstVolume_list, secondVolume_list) {
	let res;

	const first_total = countTotalVolume(firstVolume_list);
	const second_total = countTotalVolume(secondVolume_list);

	if (first_total == second_total) {
		res = findFirstMissing(firstVolume_list) < findFirstMissing(secondVolume_list);
	} else {
		res = first_total < second_total;
	}
	return res;
}


/**
 * décommenter pour faire un unit test
 */
/*
module.exports = {
	contains,
	isCorrect,
	insertVolume,
	insertToPart,
	concat2Parts,
	countTotalVolume,
	findFirstMissing,
	compare
}
*/
module.exports = async function (client) {
	let userSeries;
	while (! (userSeries = await client.db.mirors.get("UserSeries")));

	userSeries.volume_list = {
		contains,
		isCorrect,
		insertVolume,
		insertToPart,
		concat2Parts,
		countTotalVolume,
		findFirstMissing,
		compare
	}
};
