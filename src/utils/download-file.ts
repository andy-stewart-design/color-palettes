export type ExportFiletype = "svg" | "css" | "js" | "json";

export function downloadFile(text: string, type: ExportFiletype) {
  const mimetypes = {
    svg: "image/svg+xml",
    css: "text/css",
    js: "text/javascript",
    json: "application/json",
  };

  const filetype = `data:${mimetypes[type]};charset=utf-8,`;

  const element = document.createElement("a");
  element.setAttribute("href", filetype + encodeURIComponent(text));
  element.setAttribute("download", `download.${type}`);
  element.style.display = "none";

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
