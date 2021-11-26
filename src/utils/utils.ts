export function download(data: any, fileName: string, contentType?: string) {
  let elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';

  let blob = new Blob([data], {
    type: contentType || 'application/octet-stream',
  });

  elink.href = URL.createObjectURL(blob);

  document.body.appendChild(elink);
  elink.click();

  document.body.removeChild(elink);
}
