import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { TProfile } from '@/lib/types/supabase-types';
import Head from 'next/head';

interface ProfileViewProps {
  profile: TProfile;
}

export const ProfileView = ({ profile }: ProfileViewProps) => {
  // Format the created_at date
  const formattedDate = new Date(profile.created_at).toLocaleDateString();

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Head>
        <title>Profile</title>
      </Head>
      <Card>
        <CardHeader>
          <CardTitle>Profile:</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Name: {profile.name}</CardDescription>
          <CardDescription>Email: {profile.email}</CardDescription>
          <CardDescription>Joined: {formattedDate}</CardDescription>
        
          <div className='mt-4'>
            <Button>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
