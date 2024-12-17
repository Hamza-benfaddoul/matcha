import { useState } from "react";
// @ts-ignore
import Modal from "react-modal";

// Bind modal to your app root element (important for accessibility)
Modal.setAppElement("#root");

interface UpdateProfileModalProps {
    
}

const UpdateProfileModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    preferences: "",
    bio: "",
    interests: "",
  });

  // Open and close modal handlers
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
    closeModal();
  };

  return (
    <div>
      {/* Update Profile Button */}
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update Profile
      </button>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Update Profile Modal"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Update Your Profile</h2>
        
        {/* Profile Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium">Gender:</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Enter your gender"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Sexual Preferences */}
          <div>
            <label className="block mb-1 font-medium">Preferences:</label>
            <input
              type="text"
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              placeholder="Enter your preferences"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Biography */}
          <div>
            <label className="block mb-1 font-medium">Biography:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short bio"
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          {/* Interests */}
          <div>
            <label className="block mb-1 font-medium">Interests (Tags):</label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g., #vegan, #geek"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UpdateProfileModal;
