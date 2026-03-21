// 1. Legacy import for Expo SDK < 51 compatibility
import * as FileSystem from 'expo-file-system/legacy';

// --- YOUR API KEY ---
const API_KEY = "AIzaSyCBxO5M83yWtgBK38KNaA7d8eiWhOA5mbE"; 

export const analyzeMedicineImage = async (imageUri) => {
  try {
    if (!API_KEY) {
      console.error("Error: Missing Gemini API Key");
      return null;
    }

    // 2. Convert image to Base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64', 
    });

    // 3. Prepare Request
    const requestBody = {
      contents: [
        {
          parts: [
            { 
              text: `Analyze this medicine image. Identify the text (OCR) and look up medical details. 
              Return ONLY a raw JSON object (no markdown, no backticks) with these exact keys:
              {
                "name": "Brand Name",
                "genericName": "Generic/Salt Name",
                "manufacturer": "Company Name",
                "mrp": "Price",
                "batchNo": "Batch Number",
                "mfgDate": "Manufacturing Date",
                "expDate": "Expiry Date",
                "uses": ["Point 1", "Point 2"],
                "benefits": ["Point 1", "Point 2"],
                "howItWorks": "Short explanation",
                "dosage": "General dosage instruction",
                "sideEffects": ["Effect 1", "Effect 2"],
                "warnings": ["Warning 1", "Warning 2"]
              }` 
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64
              }
            }
          ]
        }
      ]
    };

    // 4. Send Request (SWITCHED TO 'gemini-2.0-flash-exp')
    // This model is designed for free tier experimentation.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    const json = await response.json();

    // 5. Check for API Errors (Specific handling for Quota)
    if (json.error) {
      if (json.error.message.includes("Quota") || json.error.code === 429) {
        console.error("⚠️ Limit Reached: Please wait 60 seconds before scanning again.");
        return null;
      }
      console.error("Gemini API Error:", json.error.message);
      return null;
    }

    // 6. Parse Response
    const textOutput = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textOutput) {
      console.error("Success: Connected, but AI returned no text.");
      return null;
    }

    // Clean up markdown formatting
    const cleanText = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Network or Parsing Error:", error);
    return null;
  }
};