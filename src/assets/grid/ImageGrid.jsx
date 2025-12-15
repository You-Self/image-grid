import { useEffect, useState } from "react";
import "./ImageGrid.css";

export default function ImageGallery() {
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem("gallery");
    return saved ? JSON.parse(saved) : [];
  });

  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    localStorage.setItem("gallery", JSON.stringify(images));
  }, [images]);

  function handleFileUpload(e) {
    const files = [...e.target.files];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImages((prev) => [...prev, evt.target.result]);
      };
      reader.readAsDataURL(file);
    });
  }

  function deleteImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    function handlePaste(e) {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (evt) =>
            setImages((prev) => [...prev, evt.target.result]);
          reader.readAsDataURL(file);
        }
      }
    }

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div className="mainPage">
      <h1 className="pageName">Image Gallery</h1>

      <div className="stringInsert">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
        />
        <span className="pasteString">Ctrl + V to paste an image</span>
      </div>

      <div className="imageGroup">
        {images.map((src, i) => (
          <div key={i} className="relativeGroup">
            <img
              src={src}
              className="insideImage"
              onClick={() => setModalImage(src)}
            />

            <button
              onClick={() => deleteImage(i)}
              className="deleteImage">
              ✕
            </button>
          </div>
        ))}
      </div>

      {modalImage && (
        <div
          className="modalShow"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            className="modalImg"
          />
        </div>
      )}
    </div>
  );
}