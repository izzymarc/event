import React from 'react';

interface UserProfileProps {
  userId?: string;
}

// Minimal UserProfile Component for testing
const UserProfile: React.FC<UserProfileProps> = ({ userId: profileUserId }) => {
  return (
    <div>
      <h1>Minimal User Profile</h1>
      <p>Testing module loading...</p>
    </div>
  );
};

export default UserProfile;
