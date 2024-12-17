import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X } from 'lucide-react'
import { Form } from '@/components/ui/form'
import { CompleteProfileSchema } from '@/schemas'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import useAuth from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import TagSelector from "@/components/TagSelector";




export default function CompleteProfile() {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([])
  const {auth, setAuth} = useAuth();
  const [tags, setTags] = useState([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [profileImageIndex, setProfileImageIndex] = useState<number | null>(null)

  const handleTagsChange = (selectedTags: any) => {
    setTags(selectedTags);
    console.log("Selected Tags:", selectedTags); // Log or send this to the backend
  };

  const form = useForm<z.infer<typeof CompleteProfileSchema>>({
    resolver: zodResolver(CompleteProfileSchema),
    defaultValues: {
      gender: 'female',
      sexualPreferences: 'heterosexual',
      biography: '',
      interests: [],
      images: [],
      profileImageIndex: 0
    },
  })

  const onSubmit = async (values: z.infer<typeof CompleteProfileSchema>) => {
    const formData = new FormData();

    values.images = images
    values.profileImageIndex = profileImageIndex

    formData.append('gender', values.gender);
    formData.append('sexualPreferences', values.sexualPreferences);
    formData.append('biography', values.biography || '');
    tags.forEach((tag) => formData.append('interests', tag));
    values.images.forEach((image) => formData.append('images', image));
    formData.append('profileImageIndex', values?.profileImageIndex?.toString() || '');
    
    try {
      const response = await axios.post('/api/complete-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.accessToken}`
        },
        withCredentials: true,
      });
      setAuth({ user: response.data.user, accessToken: auth.accessToken });
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length <= 5) {
      setImages([...images, ...files])
      if (profileImageIndex === null) {
        setProfileImageIndex(0)
      }
    }
  }

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/user/tags/tagslist');
      setExistingTags([]);
      setExistingTags(response.data.tags.map((item: any) => item.tag));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <div className="max-w-md mt-10 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#F02C56]">Complete Your Personal Information</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Form {...form}>
            <div>
            <Label>Gender</Label>
            <RadioGroup
              defaultValue="female"
              className="flex mt-2"
              onValueChange={(value: "female" | "male" | "other") => form.setValue('gender', value)}
            >
              <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" aria-hidden={false} />
              <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" aria-hidden={false} />
              <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" aria-hidden={false} />
              <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
            </div>

          <div>
            <Label>Sexual Preferences</Label>
            <RadioGroup defaultValue="heterosexual" className="flex mt-2" onValueChange={(value: "other" | "heterosexual" | "homosexual" | "bisexual") => form.setValue('sexualPreferences', value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="heterosexual" id="heterosexual" aria-hidden={false} />
                <Label htmlFor="heterosexual">Heterosexual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="homosexual" id="homosexual" aria-hidden={false} />
                <Label htmlFor="homosexual">Homosexual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bisexual" id="bisexual" aria-hidden={false} />
                <Label htmlFor="bisexual">Bisexual</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="biography">Biography</Label>
            <Textarea id="biography" placeholder="Tell us about yourself..." className="border-[#F02C56] focus:ring-[#F02C56]" {...form.register('biography')} />
          </div>

          <div>
            <Label>Interests (Tags):</Label>
            <TagSelector existingTags={existingTags} onTagsChange={handleTagsChange} />
          </div>

          <div>
            <Label htmlFor="images">Upload Images (Max 5)</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={images.length >= 5}
              className="border-[#F02C56] focus:ring-[#F02C56]"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    onClick={() => {
                      setImages(images.filter((_, i) => i !== index))
                      if (profileImageIndex === index) {
                        setProfileImageIndex(images.length > 1 ? 0 : null)
                      }
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                  <input
                    type="radio"
                    name="profileImage"
                    checked={profileImageIndex === index}
                    onChange={() => setProfileImageIndex(index)}
                    className="absolute bottom-0 right-0 accent-[#F02C56]"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#F02C56] hover:bg-[#d02548]">Save Profile</Button>
        </Form>
      </form>
    </div>
  )

}