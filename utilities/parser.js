const fs = require("fs");

function read_file(filename) {
	return fs
		.readFileSync(filename)
		.toString()
		.split(/\n\r?|\n\t?|\r/);
}

function arrange_words_by_alphabet(words) {
	let arranged_words_by_alphabet = {};
	for (let word in words) {
		if (!/[0-9]+/.test(words[word]) && words[word].length) {
			if (
				arranged_words_by_alphabet.hasOwnProperty(
					words[word][0].toLowerCase()
				)
			) {
				arranged_words_by_alphabet[words[word][0].toLowerCase()].push(
					words[word].toLowerCase()
				);
			} else {
				arranged_words_by_alphabet[words[word][0].toLowerCase()] = [];
				arranged_words_by_alphabet[words[word][0].toLowerCase()].push(
					words[word].toLowerCase()
				);
			}
		}
	}
	return arranged_words_by_alphabet;
}

function create_regex(characters_position, characters) {
	if (characters_position == "starting") {
		return new RegExp(`^${characters}`);
	} else if (characters_position == "ending") {
		return new RegExp(`${characters}$`);
	} else if (characters_position == "in") {
		return new RegExp(`[a-zA-Z]+?${characters}[a-zA-Z]+?`);
	}
}

function get_matching_words(characters_position, characters, matching_regex) {
	let matching_words = [];
	if (characters_position == "starting") {
		let beginning_character = characters[0];
		matching_words = arranged_words_by_alphabet[beginning_character].filter(
			function(word) {
				if (matching_regex.test(word)) {
					return true;
				}
			}
		);
		return matching_words;
	} else if (characters_position == "ending" || characters_position == "in") {
		for (let character in arranged_words_by_alphabet) {
			arranged_words_by_alphabet[character].forEach(function(word) {
				if (matching_regex.test(word)) {
					matching_words.push(word);
				}
			});
		}
		return matching_words;
	}
}
const words = read_file("./data/words.txt");
const arranged_words_by_alphabet = arrange_words_by_alphabet(words);
exports.get_words = (characters_position, characters) => {
	const matching_regex = create_regex(characters_position, characters);
	let matching_words = get_matching_words(
		characters_position,
		characters,
		matching_regex
	);
	return matching_words;
};

exports.arrange_words_by_alphabet = arrange_words_by_alphabet;
