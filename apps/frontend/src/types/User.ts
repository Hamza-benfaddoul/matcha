
export type User = {
    id: string;          // Unique identifier for the user
    firstname: string;   // First name of the user
    lastname: string;    // Last name of the user
    gender: string;  // Gender of the user
    sexual_preferences: string;  // Sexual preference of the user
    biography?: string;  // Biography of the user
    interests?: string[];  // Interests of the user
    profile_picture: string;  // Profile picture of the user
    images?: File[];  // Images of the user
    profileImageIndex?: number | null;  // Index of the profile image
    longitude?: number;  // Longitude of the user's location
    latitude?: number;  // Latitude of the user's location
  };