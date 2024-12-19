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
import { User } from '@/types/User'



interface ProfileFormProps {
    initialData?: User;
    endpoint: string;
    closeModal?: () => void;
}

const ProfileForm = ({ initialData = {
  id: '',
  firstname: '',
  lastname: '',
  gender: 'male',
  sexual_preferences: 'homosexual',
  biography: '',
  profile_picture: '',
  interests: [],
  images: [],
  profileImageIndex: 0
  
}, endpoint, closeModal}: ProfileFormProps) => {
    const navigate = useNavigate();
    const [images, setImages] = useState<File[]>(initialData.images || [])
    const {auth, setAuth} = useAuth();
    const [userTags, setUserTags] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagsEdited, setTagsEdited] = useState<string[]>([]);
    const [existingTags, setExistingTags] = useState<string[]>([]);
    const [profileImageIndex, setProfileImageIndex] = useState<number | null>(null)
    
    const handleTagsChange = (selectedTags: any) => {
        const newTags = [...tags];
        
        selectedTags.forEach((tag: string) => {
            if (!newTags.includes(tag)) {
              newTags.push(tag);
            }
        });
        setTags(newTags);
        console.log("last step of tags: ", tags, selectedTags);
    };
    const handleTagsEdited = (selectedTags: any) => { // tags that are listed to user and he change them or let them as they are
        setTagsEdited(selectedTags);
    };

    const form = useForm<z.infer<typeof CompleteProfileSchema>>({
      resolver: zodResolver(CompleteProfileSchema),
      defaultValues: {
        firstName: initialData?.firstname || '',
        lastName: initialData?.lastname || '',
        gender: initialData?.gender || 'male',
        sexualPreferences: initialData?.sexual_preferences || 'homosexual',
        biography: initialData?.biography || '',
        interests: initialData?.interests || [],
        images: initialData?.images || [],
        profileImageIndex: initialData?.profileImageIndex || 0
      },
    });

    useEffect(() => {
      form.reset({
        firstName: initialData.firstname || '',
        lastName: initialData.lastname || '',
        gender: initialData.gender || 'male',
        sexualPreferences: initialData.sexual_preferences || 'homosexual',
        biography: initialData.biography || '',
        interests: initialData.interests,
        images: initialData.images || [],
        profileImageIndex: initialData.profileImageIndex || 0
      });
    }, [initialData && initialData.id]);
  
    const onSubmit = async (values: z.infer<typeof CompleteProfileSchema>) => {
      const formData = new FormData();
      values.images = images
      values.profileImageIndex = profileImageIndex
      
      if (values.firstName) {
        formData.append('firstName', values.firstName);
      }
      if (values.lastName) {
        formData.append('lastName', values.lastName);
      }
      formData.append('gender', values.gender);
      formData.append('sexualPreferences', values.sexualPreferences);
      formData.append('biography', values.biography || '');
      tags.forEach((tag) => formData.append('interests', tag));
      tagsEdited.forEach((tag) => formData.append('interests', tag));
      values.images.forEach((image) => formData.append('images', image));
      formData.append('profileImageIndex', values?.profileImageIndex?.toString() || '');


      console.log('FormData interests:', formData.getAll('interests'));
        // Authorization: `Bearer ${auth.accessToken}`
        try {
        const response = await axios.post(`${endpoint}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        console.log("response: --> ", response);
        setAuth({ user: response.data.user, accessToken: auth.accessToken });
        // if (initialData.id)
        //     closeModal && closeModal();
        navigate(`/profile/${auth.user?.id}`);
        // location.href = `/profile/${auth.user?.id}`;
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
        const id = auth.user?.id;
        if (initialData.id)
        {
            const result = await axios.get(`/api/user/tags/${id}`)
            setUserTags([]);
            setUserTags(result.data.USER_TAGS);
            // setTags(result.data.USER_TAGS);
            setTagsEdited(result.data.USER_TAGS);
        }
        
        setExistingTags([]);
        setExistingTags(response.data.tags.map((item: any) => item.tag));
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    }
  
    useEffect(() => {
          fetchTags()
          // setImages(initialData.images || []);

    }, [initialData.id])
  
    return (
      <div className="max-w-md mt-10 mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#F02C56]">Complete Your Personal Information</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {
                initialData.id && (
                    <div>
                        <Label>First Name</Label>
                        <Input
                        type="text"
                        placeholder="First Name"
                        defaultValue={initialData.firstname}
                        {...form.register('firstName')}
                        className="
                            border-2 border-gray-300 rounded-md
                            p-2 w-full
                            focus:outline-none focus:border-blue-500
                        "/>
                        <Label>Last Name</Label>
                        <Input
                        type="text"
                        placeholder="Last Name"
                        defaultValue={initialData.lastname}
                        {...form.register('lastName')}
                        className="
                            border-2 border-gray-300 rounded-md
                            p-2 w-full
                            focus:outline-none focus:border-blue-500
                        "/> 
                    </div>
                )
              }
              <div>
              <Label>Gender</Label>
                <RadioGroup
                value={form.watch('gender')}
                className="flex mt-2"
                onValueChange={(value) => form.setValue('gender', value)}
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
              <RadioGroup value={form.watch('sexualPreferences')} className="flex mt-2" onValueChange={(value: "other" | "heterosexual" | "homosexual" | "bisexual") => form.setValue('sexualPreferences', value)}>
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
              <TagSelector existingTags={existingTags} userTags={userTags} onTagsChange={handleTagsChange} onTagsEdited={handleTagsEdited} />
            </div>
  
              { !initialData.id && 
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
          }
  
            <Button type="submit" className="w-full bg-[#F02C56] hover:bg-[#d02548]">Save Profile</Button>
          </form>
        </Form>
      </div>
    )

  
}
export default ProfileForm;