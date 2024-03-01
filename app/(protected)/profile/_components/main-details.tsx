'use client';

import React, { ChangeEvent, FC, useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { UserProfile } from '@prisma/client';
import { Card, CardContent } from '@/components/ui/card';
import {
  removeProfilePhoto,
  updateProfilePhoto,
} from '@/actions/profile/update-profile';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ProfileSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'sonner';

interface MainDetailsProps {
  profile: UserProfile;
}

const MainDetails: FC<MainDetailsProps> = ({ profile }) => {
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const { startUpload } = useUploadThing('imageUploader');

  const { setValue } = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      profile_image: '',
    },
  });

  const onSubmit = async () => {
    try {
      const imgRes = await startUpload(files);
      console.log(imgRes && imgRes[0].url);

      if (imgRes && imgRes[0].url) {
        const values = { profile_image: imgRes[0].url }; // Constructing object with profile_image field
        startTransition(() => {
          updateProfilePhoto(values)
            .then((data) => {
              if (data?.error) {
                setError(data.error);
                console.log(data.error);
              }

              if (data?.success) {
                setSuccess(data.success);
                toast(data.success);
                router.refresh();

                setPreviewImage('');
              }
            })
            .catch(() => setError('Something went wrong!'));
        });
      }
    } catch (error) {
      setError('Error uploading image');
      console.error('Error uploading image:', error);
    }
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        setValue('profile_image', imageDataUrl); // Setting the value here
        setPreviewImage(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = async () => {
    startTransition(() => {
      try {
        removeProfilePhoto();
        router.refresh();
      } catch (error) {
        console.error('Error deleting profile image:', error);
      }
    });
  };

  return (
    <div className="container p-5 mt-10 shadow-md rounded-md">
      <div className="flex justify-between items-center p-10">
        <div className="flex flex-row items-center relative gap-5">
          <Card className="w-48 h-48 relative">
            <>
              {profile?.profileImage ? (
                <CardContent
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="flex aspect-square items-center justify-center"
                >
                  <div className="relative">
                    <Image
                      src={profile.profileImage}
                      alt="Image"
                      width={200}
                      height={200}
                      className="mt-6 rounded-md"
                    />
                    {isHovered && (
                      <div className="absolute top-0 right-0 m-2">
                        <button
                          onClick={() => handleDeletePhoto()}
                          className="flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  {previewImage ? (
                    <div className="relative">
                      <Image
                        src={previewImage}
                        width={200}
                        height={200}
                        alt="Picture of the user"
                        className="mt-6 rounded-md opacity-60"
                      />
                      <div className="absolute bottom-0 right-0 m-2">
                        <Button onClick={() => onSubmit()}>
                          {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Upload
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="bg-slate-50 md:w-[180px]"
                        style={{ display: 'none' }} // Hide the input element
                        onChange={(e) => handleImage(e)}
                        ref={inputRef} // Assign a ref to the input element if needed
                      />
                      <span className="text-lg font-medium">Add Photos</span>
                      <Plus
                        className="w-8 h-8 hover:cursor-pointer"
                        onClick={() => inputRef?.current?.click()}
                      />{' '}
                      {/* Trigger click on the hidden input */}
                    </div>
                  )}
                </CardContent>
              )}
            </>
          </Card>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Jon Doe</h1>
            <span>25 Years, 5 Ft 7 In / 170 Cms</span>
            <span>Buddhist, (Caste No Bar)</span>
            <span>Kandy, Central Province, Sri Lanka</span>
            <span>B.Sc IT/ Computer Science, Software Engineer</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="secondary" size="lg">
            Preview
          </Button>
          <span className="text-gray-400">
            How your profile looks to others
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainDetails;
