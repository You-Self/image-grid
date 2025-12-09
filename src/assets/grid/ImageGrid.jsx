import { useEffect, useState } from "react";

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
    <div className="p-4">
      <h1 className="text-2xl mb-4">Image Gallery</h1>

      {/* Controls */}
      <div className="mb-4 flex gap-3 items-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
        />
        <span className="text-gray-600">Ctrl + V to insert an image</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            className="w-full h-32 object-cover cursor-pointer rounded"
            onClick={() => setModalImage(src)}
          />
        ))}
      </div>

      {/* Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            className="max-w-[90%] max-h-[90%] rounded shadow-xl"
          />
        </div>
      )}
    </div>
  );
}
