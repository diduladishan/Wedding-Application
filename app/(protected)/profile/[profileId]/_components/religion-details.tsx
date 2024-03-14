import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@prisma/client';
import EditReligion from './edit/edit-religion';
import EditLocation from './edit/edit-location';
import EditProfessional from './edit/edit-professional';
import EditFamily from './edit/edit-family';

interface ReligionDetailsProps {
  profile: UserProfile | null;
}

const ReligionDetails: FC<ReligionDetailsProps> = ({ profile }) => {
  return (
    <div className="flex">
      <div className="w-1/2 p-5">
        <div className="flex justify-between gap-5 mt-4">
          <div className="flex gap-x-2 items-center">
            <span>Religion: </span>
            <span className=" text-gray-600">
              {profile?.religion || 'Not defined'}
            </span>
          </div>

          <div className="flex gap-x-2 items-center">
            <span>Ethnicity: </span>
            <span className=" text-gray-600">
              {profile?.ethnicity || 'Not defined'}
            </span>
          </div>

          <div className="flex gap-x-2 items-center">
            <span>Caste: </span>
            <span className=" text-gray-600">
              {profile?.caste || 'Not defined'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReligionDetails;
