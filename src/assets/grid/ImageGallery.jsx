import { useEffect, useState } from "react";
import "./ImageGallery.css";

import ImageGrid from "./ImageGrid";
import ImageRow from "./ImageRow";

import "./ImageGrid.css";
import "./ImageRow.css";

export default function ImageGallery() {
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem("gallery");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("gallery", JSON.stringify(images));
  }, [images]);

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "grid";
  });
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const [previewImage, setPreviewImage] = useState(null);

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

      <button
        onClick={() =>
          setViewMode((prev) => (prev === "grid" ? "row" : "grid"))
        }
        className="switchButton"
      >
        Switch to {viewMode === "grid" ? "Row" : "Grid"}
      </button>

      <div className="stringInsert">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
        />
        <span className="pasteString">Ctrl + V to paste an image</span>
      </div>

      <div className={`viewContainer ${viewMode}`}>
        {viewMode === "grid" ? (
          <ImageGrid
            images={images}
            onSelect={setPreviewImage}
            onDelete={deleteImage}
          />
        ) : (
          <ImageRow
            images={images}
            onSelect={setPreviewImage}
            onDelete={deleteImage}
          />
        )}
      </div>

      {previewImage && (
        <div
          className="selectedImage"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} className="openedImage" />
        </div>
      )}
    </div>
  );
}
