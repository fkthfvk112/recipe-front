import { useState } from "react";

export default function FilePreview({ file }: { file: File | null }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFilePreview = () => {
    alert("하ㅣㅇ이");
    if (file === null) return;
    const reader = new FileReader();
    alert("하ㅣㅇ이2");

    reader.onloadend = () => {
      if (reader.result !== null && typeof reader.result === "string") {
        setPreview(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <button onClick={handleFilePreview}>Show Preview</button>
      {preview && <img src={preview} alt="File Preview" />}
    </div>
  );
}
