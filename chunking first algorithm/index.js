let image = document.getElementById("image");
let img = new Image();
img.crossOrigin = 'anonymous';
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
image.onchange = event => {
    const [file] = image.files;
    if (file) {
        img.src = URL.createObjectURL(file);
        img.onload = imageOnLoad;
    }
}

const imageOnLoad = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    img.style.display = 'none';
    data = ctx.getImageData(0, 0, img.width, img.height).data;
    convertImageData(img.width, img.height, data);
}

const color = (i, j, r, data, last=false) =>
    `${i}px ${j}px #\
${data[r].toString(16).padStart(2, "0")}\
${data[r+1].toString(16).padStart(2, "0")}\
${data[r+2].toString(16).padStart(2, "0")}\
${data[r+3].toString(16).padStart(2, "0")}\
${!last ? "," : ";"}\n`

const getBlock = (x, y, w, h, data) =>
    ""

const convertImageData = (width, height, data) => {
    let [fr, fg, fb, fa] = getColorIndecies(0, 0, width);
    let css = `width: 1px;
height: 1px;
background-color: rgba(${data[fr]},${data[fg]},${data[fb]},${data[fa]});
box-shadow: `
    for (let i = 0; i < width; i++) {
        for (let j = 1; j < height-1; j++) {
            let [r] = getColorIndecies(i, j, width);
            css += data[r+3] != 0 ? color(i, j, r, data) : "";
        }
    }
    const [r] = getColorIndecies(width-1, height-1, width);
    css += color(width-1, height-1, r, data, true);
    const content = document.getElementById("content");
    content.textContent = css;
    const preview = document.getElementById("preview");
    preview.style.width = width;
    preview.style.height = height;
    const div = document.createElement("div");
    div.style = css;
    while (preview.firstChild) preview.removeChild(preview.firstChild);
    preview.appendChild(div);
}

const getColorIndecies = (x, y, width) => {
    const red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
}