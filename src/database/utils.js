/**
 * Fonction that check if input in in a volume_list
 * 
 * @param {String} input 
 * @param {String} userVolume_list format volume_list
 *
 * @returns {Boolean}
 */
function isInVolume_list (input, userVolume_list) {
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

function isCorrectVolume_list (volume_list) {
	const reg = /^((\[\d+-\d+\])|(\d+))(,((\[\d+-\d+\])|(\d+)))*$/ig

	if ((reg).test(volume_list)) {
		const parts = volume_list.split(",");
		let cpt = -2; // In case serie starts by volume 0
		for (const part of parts) {
			if (part.startsWith("[")) { // check for [x-y] format
				const [start, end] = part.slice(1,-1).split("-").map(val=>parseInt(val));
				if (!start || ! end || end <= start || cpt >= end || start - cpt < 2) {
					return false
				}
				cpt = end;
			} else { // check for x format
				if (cpt >= part || part - cpt < 2) {
					return false;
				}
				cpt = parseInt(part)
			}
		}
		return true;
	}
	return false
}

function insertVolumeToPart(val, parts, i) {
	if (parts[i].startsWith("[")) {
		const [start, end] = parts[i].slice(1,-1).split("-").map(val => parseInt(val));

		if (val == start - 1) {
			parts[i] = `[${val}-${end}]`;
		} else if (val < start) {
			parts.splice(i, 0, val);
		} else if (val == end + 1) {
			parts[i] = `[${start}-${val}]`;
		} else if (val > end) {
			parts.splice(i+1, 0, val);
		}
	} else {
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
	parts = parts.map(elem => elem.toString())
	return parts
}


function concatParts(parts, i, j) {
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

function insertVolumToList(val, list) {
	let parts = list.split(",");
	
	let i = 0;
	let res = true;
	
	while (res && i < parts.length) {
		const part = parts[i];
		if (part.startsWith("[")) {
			const end = part.slice(1,-1).split("-").map(val => parseInt(val))[1];

			res = val > end;
		} else {
			res = val > parseInt(part);
		}
		i++;
	}
	i--;
	parts = insertVolumeToPart(val, parts, i);
	while (i < parts.length - 1 && parts.length != (parts = concatParts(parts, i, i+1)).length); // concat right
	while (i > 0 && parts.length > i && parts.length != (parts = concatParts(parts, i-1, i--)).length); // concat left
	
	return(parts.join(","))
}

module.exports = {
	isInVolume_list,
	isCorrectVolume_list,
	insertVolumToList,
	insertVolumeToPart,
	concatParts
}