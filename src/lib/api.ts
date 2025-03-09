// API utilities for making requests to the backend

/**
 * Get site settings from the API
 * @param section The settings section to retrieve
 * @returns Promise with the settings data
 */
export const getSettings = async (section: string) => {
  try {
    const response = await fetch(`/api/site-settings.php?section=${section}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${section} settings:`, error);
    return { success: false, message: "Failed to fetch settings", data: null };
  }
};

/**
 * Save site settings to the API
 * @param section The settings section to save
 * @param settings The settings data to save
 * @returns Promise with the response data
 */
export const saveSettings = async (section: string, settings: any) => {
  try {
    const response = await fetch("/api/site-settings.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        section,
        settings,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error saving ${section} settings:`, error);
    return { success: false, message: "Failed to save settings" };
  }
};

/**
 * Get user profile data
 * @param userId The user ID to get profile for
 * @returns Promise with the user profile data
 */
export const getUserProfile = async (userId: string) => {
  try {
    const response = await fetch(`/api/get-user-profile.php?userId=${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      message: "Failed to fetch user profile",
      profile: null,
    };
  }
};

/**
 * Update user profile data
 * @param userId The user ID to update profile for
 * @param profileData The profile data to update
 * @returns Promise with the response data
 */
export const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    const response = await fetch("/api/update-profile.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        ...profileData,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, message: "Failed to update user profile" };
  }
};

/**
 * Get user calculation history
 * @param userId The user ID to get history for
 * @returns Promise with the user history data
 */
export const getUserHistory = async (userId: string) => {
  try {
    const response = await fetch(`/api/get-user-history.php?userId=${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user history:", error);
    return {
      success: false,
      message: "Failed to fetch user history",
      history: [],
    };
  }
};

/**
 * Delete a history item
 * @param userId The user ID
 * @param historyItemId The history item ID to delete
 * @returns Promise with the response data
 */
export const deleteHistoryItem = async (
  userId: string,
  historyItemId: string,
) => {
  try {
    const response = await fetch("/api/delete-history-item.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        historyItemId,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting history item:", error);
    return { success: false, message: "Failed to delete history item" };
  }
};

/**
 * Get health recommendations
 * @param category The recommendation category
 * @param language The language code
 * @returns Promise with the recommendations data
 */
export const getHealthRecommendations = async (
  category: string,
  language: string = "en",
) => {
  try {
    const response = await fetch(
      `/api/health-recommendations.php?category=${category}&lang=${language}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching health recommendations:", error);
    return {
      success: false,
      message: "Failed to fetch recommendations",
      recommendations: [],
    };
  }
};

/**
 * Save user's saved recommendations
 * @param userId The user ID
 * @param recommendationIds Array of recommendation IDs
 * @returns Promise with the response data
 */
export const saveUserRecommendations = async (
  userId: string,
  recommendationIds: string[],
) => {
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
    return data;
  } catch (error) {
    console.error("Error saving user recommendations:", error);
    return { success: false, message: "Failed to save recommendations" };
  }
};

/**
 * Get user's saved recommendations
 * @param userId The user ID
 * @returns Promise with the saved recommendation IDs
 */
export const getUserRecommendations = async (userId: string) => {
  try {
    const response = await fetch(
      `/api/get-user-recommendations.php?userId=${userId}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user recommendations:", error);
    return {
      success: false,
      message: "Failed to fetch recommendations",
      recommendationIds: [],
    };
  }
};

/**
 * Generate AI response using OpenAI API
 * @param prompt The prompt to send to the API
 * @param apiKey The OpenAI API key
 * @param model The model to use
 * @returns Promise with the generated text
 */
export const generateOpenAIResponse = async (
  prompt: string,
  apiKey: string,
  model: string = "gpt-4-turbo",
) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
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
};

/**
 * Generate AI response using Google Gemini API
 * @param prompt The prompt to send to the API
 * @param apiKey The Gemini API key
 * @param model The model to use
 * @returns Promise with the generated text
 */
export const generateGeminiResponse = async (
  prompt: string,
  apiKey: string,
  model: string = "gemini-pro",
) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
            temperature: 0.7,
            maxOutputTokens: 1000,
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
};

/**
 * Generate AI response using Anthropic Claude API
 * @param prompt The prompt to send to the API
 * @param apiKey The Claude API key
 * @param model The model to use
 * @returns Promise with the generated text
 */
export const generateClaudeResponse = async (
  prompt: string,
  apiKey: string,
  model: string = "claude-3-opus",
) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
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
};

/**
 * Test API connection
 * @param apiType The type of API to test (openai, gemini, claude)
 * @param apiKey The API key to test
 * @returns Promise with the test result
 */
export const testAPIConnection = async (
  apiType: "openai" | "gemini" | "claude",
  apiKey: string,
) => {
  try {
    let result = "";

    switch (apiType) {
      case "openai":
        result = await generateOpenAIResponse(
          "Hello, this is a test message.",
          apiKey,
        );
        break;
      case "gemini":
        result = await generateGeminiResponse(
          "Hello, this is a test message.",
          apiKey,
        );
        break;
      case "claude":
        result = await generateClaudeResponse(
          "Hello, this is a test message.",
          apiKey,
        );
        break;
    }

    return {
      success: true,
      message: `Successfully connected to ${apiType}!`,
      result,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to ${apiType}: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
