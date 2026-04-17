/**
 * @file client/src/components/Admin/ImageUploader.jsx
 * @description Dual-mode image uploader: paste a URL link OR upload a file from disk.
 * File uploads go to Firebase Storage and return a CDN download URL.
 * Theme: Cream/Peach (#FBE8CE) + Orange (#F96D00)
 */

import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../utils/firebaseConfig';
import toast from 'react-hot-toast';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function ImageUploader({ images = [], onChange, maxImages = MAX_IMAGES }) {
  const [uploadType, setUploadType] = useState('url'); // 'url' | 'file'
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  /* ── ADD VIA URL ──────────────────────────────────────────────── */
  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) { toast.error('Please enter an image URL'); return; }
    try { new URL(trimmed); } catch { toast.error('Please enter a valid URL'); return; }
    if (images.length >= maxImages) { toast.error(`Maximum ${maxImages} images allowed`); return; }

    const next = [...images, trimmed];
    onChange(next);
    setUrlInput('');
    toast.success('Image URL added ✅');
  };

  /* ── UPLOAD FILE ──────────────────────────────────────────────── */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP files are allowed'); return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large — max 2 MB'); return;
    }
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`); return;
    }
    if (!storage) {
      toast.error('Firebase Storage is not configured'); return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const fileName = `products/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(pct);
        },
        (error) => {
          console.error('Upload error:', error);
          toast.error('Upload failed — check Firebase Storage rules');
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange([...images, downloadURL]);
          setUploading(false);
          setUploadProgress(0);
          // reset file input so same file can be re-selected
          if (fileInputRef.current) fileInputRef.current.value = '';
          toast.success('Image uploaded ✅');
        }
      );
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
      setUploading(false);
    }
  };

  /* ── REMOVE IMAGE ─────────────────────────────────────────────── */
  const handleRemove = (index) => {
    onChange(images.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  /* ── RENDER ───────────────────────────────────────────────────── */
  return (
    <div className="bg-white border border-[#E8C99A] rounded-2xl p-6">

      {/* Title */}
      <h3 className="text-gray-900 font-bold text-base mb-1">
        🖼️ Product Images
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Upload up to {maxImages} images. First image will be the main display image.
      </p>

      {/* Toggle tabs */}
      <div className="flex gap-2 mb-4 bg-[#FBE8CE] p-1 rounded-xl w-fit">
        {[
          { key: 'url', label: '🔗 URL Link' },
          { key: 'file', label: '📁 File Upload' },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setUploadType(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              uploadType === key
                ? 'bg-[#F96D00] text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── URL INPUT ── */}
      {uploadType === 'url' && (
        <div className="bg-[#FBE8CE] border border-[#E8C99A] rounded-xl p-4 mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Paste Image URL:
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-2.5 border border-[#E8C99A] rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F96D00] focus:border-[#F96D00] transition-all"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-5 py-2.5 bg-[#F96D00] hover:bg-[#E86500] text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
            >
              + Add URL
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Use direct image URLs ending in .jpg .png .webp
          </p>
        </div>
      )}

      {/* ── FILE UPLOAD ── */}
      {uploadType === 'file' && (
        <div className="bg-[#FBE8CE] border border-[#E8C99A] rounded-xl p-4 mb-4">
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-[#E8C99A] rounded-xl p-8 text-center cursor-pointer transition-all ${
              uploading ? 'bg-[#E4DFB5]' : 'bg-white hover:border-[#F96D00] hover:bg-[#FBE8CE]'
            }`}
          >
            {uploading ? (
              <>
                <div className="text-4xl mb-2">⏳</div>
                <p className="text-gray-900 font-semibold mb-3">
                  Uploading… {uploadProgress}%
                </p>
                <div className="bg-[#E8C99A] rounded-full h-2 w-full overflow-hidden">
                  <div
                    className="h-full bg-[#F96D00] rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-2">📁</div>
                <p className="text-gray-900 font-semibold text-sm">Click to select image</p>
                <p className="text-gray-500 text-xs mt-1">JPG, PNG, WEBP • Max 2MB</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            🔥 Image uploads to Firebase Storage automatically
          </p>
        </div>
      )}

      {/* ── IMAGE PREVIEW GRID ── */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-3">
            📸 Added Images ({images.length}/{maxImages}):
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-xl overflow-hidden border-2 border-[#E8C99A] bg-gray-50"
              >
                <img
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/90x90/FBE8CE/F96D00?text=Error';
                  }}
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                {/* Badge */}
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {index === 0 ? 'Main' : `#${index + 1}`}
                </div>
              </div>
            ))}

            {/* Add more slot */}
            {images.length < maxImages && (
              <div
                onClick={() => uploadType === 'file' ? fileInputRef.current?.click() : null}
                className="border-2 border-dashed border-[#E8C99A] rounded-xl flex flex-col items-center justify-center cursor-pointer aspect-square bg-[#FBE8CE] hover:bg-[#E4DFB5] hover:border-[#F96D00] text-gray-400 hover:text-gray-600 text-xs transition-all"
              >
                <span className="text-2xl mb-1">+</span>
                <span>Add More</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {images.length === 0 && (
        <div className="text-center py-8 bg-[#FBE8CE] border border-dashed border-[#E8C99A] rounded-xl">
          <p className="text-gray-500 text-sm">
            📷 No images added yet.<br />Use URL or File Upload above.
          </p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
