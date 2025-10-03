import { User } from "./User";


// Represents the authenticated user in your app
export interface AuthUser {
  id: string;                        // Supabase user id
  email: string;
  email_verified: boolean;           // Supabase naming
  phone_verified: boolean;           // optional, you can track separately
  role: string;                      // Supabase user_metadata.role or app role
  display_name?: string;             // Supabase user_metadata.display_name
  is_logged_in: boolean;             // app-specific flag
  additional_data?: User;            // extended app-specific user info
  is_profile_completed: boolean;     // app-specific
}

// Represents the current Supabase session
export interface AuthSession {
  access_token: string;              // Supabase access token
  refresh_token: string;             // Supabase refresh token
  expires_at: number;                // UNIX timestamp
  user: AuthUser;
}

// Context type for React / React Native
export interface AuthContextType {
  user: AuthUser | null;
  access_token: string | null;
  login: (data: Partial<AuthUser> & { access_token?: string; refresh_token?: string }) => void;
  logout: () => void;
  updateAuth: (updates: Partial<AuthUser>) => void;
  is_loading: boolean;
}

// Supabase Auth API response
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    user_metadata: {
      email_verified: boolean;
      display_name: string;
    };
  };
}
