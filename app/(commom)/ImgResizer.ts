import Resizer from "react-image-file-resizer";

export const resizeFile = (file:File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      512,
      512,
      "WEBP",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

  
export const resizeFileToBase64 = (file:File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      512,
      512,
      "WEBP",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
