const mammoth = require("mammoth");
const TurndownService = require("turndown");
const { gfm } = require("turndown-plugin-gfm");
const path = require("path");
const fs = require("fs");

const turndownService = new TurndownService();
turndownService.use(gfm);
turndownService.addRule("img", {
  filter: "img",
  replacement: function (content, node) {
    const src = node.getAttribute("src");
    const alt = node.getAttribute("alt") || "";
    return `![${alt}](${src})`;
  },
});
turndownService.addRule("tableToMarkdown", {
  filter: "table",
  replacement: function (content, node) {
    const rows = Array.from(node.querySelectorAll("tr"));
    const markdownRows = rows.map((tr) => {
      const cells = Array.from(tr.querySelectorAll("td, th")).map((td) => {
        let mdContent = turndownService.turndown(td.innerHTML);

        mdContent = mdContent
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("<br>");

        return mdContent;
      });
      return "| " + cells.join(" | ") + " |";
    });

    if (markdownRows.length > 0) {
      const colCount = (markdownRows[0].match(/\|/g) || []).length - 1;
      const separator = "| " + Array(colCount).fill("---").join(" | ") + " |";
      markdownRows.splice(1, 0, separator);
    }

    return "\n\n" + markdownRows.join("\n") + "\n\n";
  },
});

module.exports = convertDocxToMarkdown = async (fileBuffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await mammoth.convertToHtml(
        { buffer: fileBuffer },
        {
          convertImage: mammoth.images.inline(async (image) => {
            const ext = image.contentType?.split("/")[1];
            const fileName = `${(await import("nanoid")).nanoid(16)}.${ext}`;
            const uploadPath = path.join(
              process.cwd(),
              process.env.LOCAL_UPLOAD_DIR,
              fileName
            );

            const buffer = await image.read();
            fs.writeFileSync(uploadPath, buffer);

            return {
              src: `${process.env.NETWORK_UPLOAD_DIR}/${fileName}`,
              alt: fileName,
            };
          }),
        }
      );
      const html = result.value;
      const markdown = turndownService.turndown(html);

      resolve(markdown);
    } catch (err) {
      reject(err);
    }
  });
};
