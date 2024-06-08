const javaDeserialization = require("java-deserialization");
const JSZip = require("jszip");
const Buffer = require('buffer/').Buffer  // note: the trailing slash is important!

const fileInput = document.querySelector(".js-file");
const spinner = document.querySelector(".js-spinner");
const processContainer = document.querySelector(".js-process");
const countContainer = document.querySelector(".js-processed-count");
const downloadButton = document.querySelector(".js-download");

const parseFileToSongs = content => {
  const [{list}] = javaDeserialization.parse(content);
  return list.map(({lyrics, title, artist}) => ({
    title: title.trim(),
    artist: artist.trim(),
    text: lyrics,
    firstRow: (
      lyrics
        .split("\n")
        .filter(row => row.trim().length > 5)
        .shift() || ""
    ).replace(/[.,!?-]$/g, "").trim(),
  }));
};

const handleFileSelect = async () => {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }

  spinner.classList.remove("d-none");
  const fileContent = Buffer(await file.arrayBuffer());
  const songsArray = parseFileToSongs(fileContent);

  countContainer.innerText = songsArray.length;

  const zip = new JSZip();
  for (const song of songsArray) {
    const valueInBrackets = song.artist || song.firstRow;
    const fileName = `${song.title}${
      valueInBrackets ? ` (${valueInBrackets})` : ""
    }.txt`.replace(/\//g, "-");
    zip.file(fileName, song.text);
  }
  const zipBlob = await zip.generateAsync({type: "blob"});
  downloadButton.href = URL.createObjectURL(zipBlob);
  downloadButton.download = `${file.name.replace(/\.txt$/i, "").replace(/\s/ig, "_")}_Holyrics2txt_${Date.now()}.zip`;

  spinner.classList.add("d-none");
  processContainer.classList.remove("d-none");
};
fileInput.addEventListener("change", handleFileSelect);
