// API Integration for AI services and database operations

// AI API Integration
export interface AIServiceConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

export interface AIServicesConfig {
  openai: AIServiceConfig;
  gemini: AIServiceConfig;
  anthropic: AIServiceConfig;
  defaultService: "openai" | "gemini" | "anthropic";
}

// Default configuration
const defaultAIConfig: AIServicesConfig = {
  openai: {
    apiKey: "",
    model: "gpt-4-turbo",
    temperature: 0.7,
    maxTokens: 1000,
    enabled: true,
  },
  gemini: {
    apiKey: "",
    model: "gemini-pro",
    temperature: 0.7,
    maxTokens: 1000,
    enabled: false,
  },
  anthropic: {
    apiKey: "",
    model: "claude-3-opus",
    temperature: 0.7,
    maxTokens: 1000,
    enabled: false,
  },
  defaultService: "openai",
};

// Load AI configuration from localStorage or use defaults
export const getAIConfig = (): AIServicesConfig => {
  const storedConfig = localStorage.getItem("aiServicesConfig");
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig);
    } catch (e) {
      console.error("Error parsing AI config:", e);
      return defaultAIConfig;
    }
  }
  return defaultAIConfig;
};

// Save AI configuration to localStorage
export const saveAIConfig = (config: AIServicesConfig): void => {
  localStorage.setItem("aiServicesConfig", JSON.stringify(config));
};

// Generate AI response based on prompt
export const generateAIResponse = async (prompt: string): Promise<string> => {
  const config = getAIConfig();
  const service = config.defaultService;
  const serviceConfig = config[service];

  if (!serviceConfig.enabled || !serviceConfig.apiKey) {
    throw new Error(`${service} is not enabled or missing API key`);
  }

  try {
    // Determine which API to use
    switch (service) {
      case "openai":
        return await callOpenAI(prompt, serviceConfig);
      case "gemini":
        return await callGemini(prompt, serviceConfig);
      case "anthropic":
        return await callAnthropic(prompt, serviceConfig);
      default:
        throw new Error("Invalid AI service selected");
    }
  } catch (error) {
    console.error(`Error generating AI response with ${service}:`, error);
    throw error;
  }
};

// OpenAI API call
async function callOpenAI(
  prompt: string,
  config: AIServiceConfig,
): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: prompt }],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Unknown error from OpenAI");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

// Google Gemini API call
async function callGemini(
  prompt: string,
  config: AIServiceConfig,
): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
          },
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Unknown error from Gemini");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

// Anthropic Claude API call
async function callAnthropic(
  prompt: string,
  config: AIServiceConfig,
): Promise<string> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: config.maxTokens,
        temperature: config.temperature,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Unknown error from Anthropic");
    }

    return data.content[0].text;
  } catch (error) {
    console.error("Anthropic API error:", error);
    throw error;
  }
}

// Database API functions
export interface DatabaseSettings {
  host: string;
  username: string;
  password: string;
  database: string;
  port: number;
  connectionString: string;
}

// Get recommendations from database
export const getRecommendations = async (
  category: string,
  language: string = "en",
): Promise<any[]> => {
  try {
    const response = await fetch(
      `/api/health-recommendations.php?category=${category}&lang=${language}`,
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch recommendations");
    }

    return data.recommendations || [];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

// Save user recommendation preferences
export const saveRecommendationPreferences = async (
  userId: string,
  preferences: any,
): Promise<void> => {
  try {
    const response = await fetch("/api/update-preferences.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        preferences,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to save preferences");
    }
  } catch (error) {
    console.error("Error saving recommendation preferences:", error);
    throw error;
  }
};

// Save user's saved recommendations
export const saveUserRecommendations = async (
  userId: string,
  recommendationIds: string[],
): Promise<void> => {
  try {
    const response = await fetch("/api/save-user-recommendations.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        recommendationIds,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to save user recommendations");
    }
  } catch (error) {
    console.error("Error saving user recommendations:", error);
    throw error;
  }
};

// Get user's saved recommendations
export const getUserRecommendations = async (
  userId: string,
): Promise<string[]> => {
  try {
    const response = await fetch(
      `/api/get-user-recommendations.php?userId=${userId}`,
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user recommendations");
    }

    return data.recommendationIds || [];
  } catch (error) {
    console.error("Error fetching user recommendations:", error);
    throw error;
  }
};
