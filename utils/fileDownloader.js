export const handleDownload = (url, filename) => {
  fetch(url, {
    mode: "cors",
    headers: new Headers({
      Origin: window.location.origin,
    }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || url.split("/").pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    })
    .catch(() => {
      window.open(url, "_blank");
    });
};
