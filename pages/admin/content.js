import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import { DocumentTextIcon, HomeIcon, UserIcon, InformationCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

// Image Upload Component
function ImageUpload({ label, value, onChange, preview, setPreview, uploading, setUploading }) {
  const [file, setFile] = useState(null);

  const handleImageUpload = async (file) => {
    if (!file) return null;

    setUploading(true);
    try {
      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Image uploaded successfully!');
        return data.imagePath;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validateFile = (file) => {
    // Check file type
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'];
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
      return 'Please select a valid image file (PNG, JPG, WEBP, or GIF)';
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file
      const validationError = validateFile(selectedFile);
      if (validationError) {
        toast.error(validationError);
        e.target.value = ''; // Clear the input
        return;
      }

      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);

      // Upload file
      const uploadedPath = await handleImageUpload(selectedFile);
      if (uploadedPath) {
        onChange(uploadedPath);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

      const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const droppedFile = files[0];

      // Validate file
      const validationError = validateFile(droppedFile);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      setFile(droppedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(droppedFile);

      // Upload file
      const uploadedPath = await handleImageUpload(droppedFile);
      if (uploadedPath) {
        onChange(uploadedPath);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-amber-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={`image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
              className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
            >
              <span>{uploading ? 'Uploading...' : 'Upload an image'}</span>
              <input
                id={`image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/webp,image/gif"
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP, GIF up to 5MB</p>
        </div>
      </div>
      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-md mx-auto"
          />
        </div>
      )}
    </div>
  );
}

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: HomeIcon },
    { id: 'about', name: 'About Section', icon: UserIcon },
    { id: 'footer', name: 'Footer', icon: InformationCircleIcon },
  ];

  useEffect(() => {
    if (router.query.section) {
      setActiveSection(router.query.section);
    }
  }, [router.query]);

  useEffect(() => {
    fetchContent();
  }, [activeSection]);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/content?section=${activeSection}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error fetching content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ section: activeSection, ...formData }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setContent(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderHeroForm = () => (
    <HeroForm content={content} onSave={handleSave} saving={saving} />
  );

  const renderAboutForm = () => (
    <AboutForm content={content} onSave={handleSave} saving={saving} />
  );

  const renderFooterForm = () => (
    <FooterForm content={content} onSave={handleSave} saving={saving} />
  );

  const renderForm = () => {
    switch (activeSection) {
      case 'hero':
        return renderHeroForm();
      case 'about':
        return renderAboutForm();
      case 'footer':
        return renderFooterForm();
      default:
        return null;
    }
  };

  return (
    <AdminLayout title="Edit Content">
      <div className="space-y-6">
        {/* Section Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  router.push(`/admin/content?section=${section.id}`, undefined, { shallow: true });
                }}
                className={`${
                  activeSection === section.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <section.icon className="h-5 w-5 mr-2" />
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Content Form */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              </div>
            ) : (
              renderForm()
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Hero Form Component
function HeroForm({ content, onSave, saving }) {
  const [formData, setFormData] = useState({
    title: content.title || '',
    subtitle: content.subtitle || '',
    description: content.description || '',
    buttonText: content.buttonText || '',
    buttonLink: content.buttonLink || '',
    backgroundImage: content.backgroundImage || '',
  });
  const [backgroundPreview, setBackgroundPreview] = useState(content.backgroundImage || '');
  const [uploadingBackground, setUploadingBackground] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBackgroundImageChange = (imagePath) => {
    setFormData(prev => ({
      ...prev,
      backgroundImage: imagePath,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">Hero Section</h3>
        <p className="mt-1 text-sm text-gray-500">
          Edit the main hero section that appears on your homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
            Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            id="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700">
              Button Text
            </label>
            <input
              type="text"
              name="buttonText"
              id="buttonText"
              value={formData.buttonText}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700">
              Button Link
            </label>
            <input
              type="text"
              name="buttonLink"
              id="buttonLink"
              value={formData.buttonLink}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <ImageUpload
            label="Background Image"
            value={formData.backgroundImage}
            onChange={handleBackgroundImageChange}
            preview={backgroundPreview}
            setPreview={setBackgroundPreview}
            uploading={uploadingBackground}
            setUploading={setUploadingBackground}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || uploadingBackground}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
        >
          {uploadingBackground ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

// About Form Component
function AboutForm({ content, onSave, saving }) {
  const [formData, setFormData] = useState({
    title: content.title || '',
    description: content.description || '',
    image: content.image || '',
    skills: content.skills || [],
    experience: content.experience || '',
  });
  const [profilePreview, setProfilePreview] = useState(content.image || '');
  const [uploadingProfile, setUploadingProfile] = useState(false);

  // Update form data when content changes
  useEffect(() => {
    setFormData({
      title: content.title || '',
      description: content.description || '',
      image: content.image || '',
      skills: Array.isArray(content.skills) ? content.skills : [],
      experience: content.experience || '',
    });
    setProfilePreview(content.image || '');
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skills,
    }));
  };

  const handleProfileImageChange = (imagePath) => {
    setFormData(prev => ({
      ...prev,
      image: imagePath,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">About Section</h3>
        <p className="mt-1 text-sm text-gray-500">
          Edit the about section content.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={6}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div>
          <ImageUpload
            label="Profile Image"
            value={formData.image}
            onChange={handleProfileImageChange}
            preview={profilePreview}
            setPreview={setProfilePreview}
            uploading={uploadingProfile}
            setUploading={setUploadingProfile}
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            id="skills"
            value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
            onChange={handleSkillsChange}
            placeholder="Oil Painting, Watercolor, Digital Art, etc."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Experience
          </label>
          <input
            type="text"
            name="experience"
            id="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g., 10+ years"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || uploadingProfile}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
        >
          {uploadingProfile ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

// Footer Form Component
function FooterForm({ content, onSave, saving }) {
  const [formData, setFormData] = useState({
    copyrightText: content.copyrightText || '',
    socialLinks: content.socialLinks || {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    email: content.email || '',
    phone: content.phone || '',
    address: content.address || '',
    newsletterText: content.newsletterText || '',
  });

  // Update form data when content changes
  useEffect(() => {
    setFormData({
      copyrightText: content.copyrightText || '',
      socialLinks: content.socialLinks || {
        facebook: '',
        instagram: '',
        twitter: ''
      },
      email: content.email || '',
      phone: content.phone || '',
      address: content.address || '',
      newsletterText: content.newsletterText || '',
    });
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">Footer Section</h3>
        <p className="mt-1 text-sm text-gray-500">
          Edit the footer content and contact information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="copyrightText" className="block text-sm font-medium text-gray-700">
            Copyright Text
          </label>
          <input
            type="text"
            name="copyrightText"
            id="copyrightText"
            value={formData.copyrightText}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Contact Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            name="address"
            id="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="newsletterText" className="block text-sm font-medium text-gray-700">
            Newsletter Text
          </label>
          <textarea
            name="newsletterText"
            id="newsletterText"
            rows={2}
            value={formData.newsletterText}
            onChange={handleChange}
            placeholder="Stay updated with our latest artworks and events."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Social Media Links</label>
          <div className="space-y-4">
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-600">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook"
                id="facebook"
                value={formData.socialLinks.facebook || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialLinks: {
                    ...prev.socialLinks,
                    facebook: e.target.value
                  }
                }))}
                placeholder="https://facebook.com/yourpage"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-600">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram"
                id="instagram"
                value={formData.socialLinks.instagram || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialLinks: {
                    ...prev.socialLinks,
                    instagram: e.target.value
                  }
                }))}
                placeholder="https://instagram.com/yourprofile"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-600">
                Twitter URL
              </label>
              <input
                type="url"
                name="twitter"
                id="twitter"
                value={formData.socialLinks.twitter || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialLinks: {
                    ...prev.socialLinks,
                    twitter: e.target.value
                  }
                }))}
                placeholder="https://twitter.com/yourhandle"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

