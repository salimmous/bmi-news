// API utilities for interacting with the backend

// Base URL for API requests - change this based on your hosting environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Interface for site settings structure
export interface SiteSettings {
  general: {
    site_name: string;
    site_description: string;
    contact_email: string;
    footer_text: string;
    logo_path?: string;
    favicon_path?: string;
  };
  social: {
    social_facebook: string;
    social_twitter: string;
    social_instagram: string;
    social_linkedin: string;
  };
  appearance: {
    primary_color: string;
    secondary_color: string;
    font_family: string;
    dark_mode: string;
  };
  layout: {
    show_hero: string;
    show_testimonials: string;
    show_features: string;
    show_blog: string;
  };
}

// Interface for API response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  files?: Record<string, { success: boolean; file_path?: string; message?: string }>;
}

// Get all site settings or settings by group
export async function getSettings(group?: string): Promise<ApiResponse<SiteSettings>> {
  try {
    const url = group
      ? `${API_BASE_URL}/site-settings.php?group=${encodeURIComponent(group)}`
      : `${API_BASE_URL}/site-settings.php`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText.substring(0, 100));
      
      // For navigation settings, return a mock success response with empty data
      // This allows the UI to fall back to default settings
      if (group === 'navigation') {
        console.warn('Returning mock navigation settings due to non-JSON response');
        return { 
          success: true, 
          data: {
            general: {
              site_name: '',
              site_description: '',
              contact_email: '',
              footer_text: ''
            },
            social: {
              social_facebook: '',
              social_twitter: '',
              social_instagram: '',
              social_linkedin: ''
            },
            appearance: {
              primary_color: '',
              secondary_color: '',
              font_family: '',
              dark_mode: ''
            },
            layout: {
              show_hero: '',
              show_testimonials: '',
              show_features: '',
              show_blog: ''
            }
          } 
        };
      }
      
      return { 
        success: false, 
        message: `Expected JSON response but got ${contentType || 'unknown content type'}. Check server configuration.` 
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Return a more graceful error response that allows components to use default settings
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error',
      data: group === 'navigation' ? {
        general: {
          site_name: '',
          site_description: '',
          contact_email: '',
          footer_text: ''
        },
        social: {
          social_facebook: '',
          social_twitter: '',
          social_instagram: '',
          social_linkedin: ''
        },
        appearance: {
          primary_color: '',
          secondary_color: '',
          font_family: '',
          dark_mode: ''
        },
        layout: {
          show_hero: '',
          show_testimonials: '',
          show_features: '',
          show_blog: ''
        }
      } : undefined // Provide empty data structure for navigation to use defaults
    };
  }
}

// Update site settings
export async function updateSettings(settings: Partial<SiteSettings>): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_BASE_URL}/site-settings.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating settings:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Upload logo or favicon
export async function uploadFile(fileType: 'logo' | 'favicon', file: File): Promise<ApiResponse<null>> {
  try {
    const formData = new FormData();
    formData.append(fileType, file);

    const response = await fetch(`${API_BASE_URL}/site-settings.php`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error uploading ${fileType}:`, error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// API key management
export interface ApiKey {
  id: number;
  api_key: string;
  name: string;
  permissions: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

// Get API keys for a user
export async function getApiKeys(userId: number): Promise<ApiResponse<ApiKey[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys.php?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Create a new API key
export async function createApiKey(userId: number, name: string, permissions: string[]): Promise<ApiResponse<ApiKey>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        name,
        permissions: permissions.join(','),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating API key:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Delete an API key
export async function deleteApiKey(keyId: number): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys.php?id=${keyId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting API key:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Webhook management
export interface Webhook {
  id: number;
  name: string;
  url: string;
  event_type: string;
  secret_key: string | null;
  is_active: boolean;
  created_at: string;
}

// Get all webhooks
export async function getWebhooks(): Promise<ApiResponse<Webhook[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/webhooks.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Create a new webhook
export async function createWebhook(webhook: Omit<Webhook, 'id' | 'created_at'>): Promise<ApiResponse<Webhook>> {
  try {
    const response = await fetch(`${API_BASE_URL}/webhooks.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhook),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating webhook:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Update a webhook
export async function updateWebhook(id: number, webhook: Partial<Omit<Webhook, 'id' | 'created_at'>>): Promise<ApiResponse<Webhook>> {
  try {
    const response = await fetch(`${API_BASE_URL}/webhooks.php?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhook),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating webhook:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Delete a webhook
export async function deleteWebhook(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_BASE_URL}/webhooks.php?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Widget management
export interface Widget {
  id: number;
  name: string;
  description: string | null;
  widget_type: string;
  dashboard_type: 'admin' | 'user' | 'both';
  settings: string | null;
  is_active: boolean;
  display_order: number;
}

// Get all widgets
export async function getWidgets(dashboardType?: 'admin' | 'user' | 'both'): Promise<ApiResponse<Widget[]>> {
  try {
    const url = dashboardType
      ? `${API_BASE_URL}/widgets.php?dashboard_type=${encodeURIComponent(dashboardType)}`
      : `${API_BASE_URL}/widgets.php`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching widgets:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get user widget preferences
export async function getUserWidgets(userId: number): Promise<ApiResponse<any[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/widgets.php?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user widgets:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Update user widget preferences
export async function updateUserWidgets(userId: number, widgets: any[]): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_BASE_URL}/widgets.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        widgets,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Instead of throwing an error immediately, try to get the response text
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Server response: ${responseText.substring(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user widgets:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}