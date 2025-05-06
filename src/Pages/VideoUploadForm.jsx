import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const VideoUploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Form 3',
    difficulty: 'Beginner',
    instructor: '',
    rating: 0.0,
    image: '',
    file: null
  });

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(`${BASE_URL}/experiment_videos/`, data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setVideoData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Experiment Video</h2>

      {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Title', name: 'title', type: 'text', required: true },
          { label: 'Instructor', name: 'instructor', type: 'text', required: true },
          { label: 'Rating (0-5)', name: 'rating', type: 'number', min: 0, max: 5, step: 0.1 },
          { label: 'Thumbnail Image URL', name: 'image', type: 'url' }
        ].map(({ label, name, ...rest }) => (
          <div key={name}>
            <label className="block mb-1 font-medium text-gray-700">{label}</label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              {...rest}
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
            isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </button>

        {isUploading && (
          <div className="mt-2">
            <progress value={progress} max="100" className="w-full" />
            <div className="text-sm text-gray-600 mt-1">{progress}%</div>
          </div>
        )}
      </form>

      {videoData && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Video Uploaded Successfully!</h3>
          <p className="text-gray-700 mb-2">{videoData.title}</p>
          <p className="text-sm text-gray-600 mb-4">{videoData.description}</p>
          {videoData.thumbnail && (
            <img
              src={videoData.thumbnail}
              alt="Thumbnail"
              className="w-48 h-auto mb-4 rounded-lg border"
            />
          )}
          <video
            controls
            className="w-full rounded-lg shadow"
            src={`https://videodelivery.net/${videoData.uid}/manifest/video.m3u8`}
          />
        </div>
      )}
    </div>
  );
};

export default VideoUploadForm;
