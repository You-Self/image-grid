export default function ImageRow({ images, onSelect, onDelete }) {
  return (
    <div className="rowGroup">
      {images.map((src, i) => (
        <div key={i} className="rowItem">
          <img
            src={src}
            className="rowImage"
            onClick={() => onSelect(src)}
          />
          <button
            className="deleteImage"
            onClick={() => onDelete(i)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
