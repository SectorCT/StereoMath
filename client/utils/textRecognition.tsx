import { ImagePickerAsset } from "expo-image-picker";

export default async function recognizeTextFromImage(
  base64Image: ImagePickerAsset | string | null | undefined
) {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;

  const requestPayload = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [{ type: "TEXT_DETECTION" }],
      },
    ],
  };

  try {
    const response = await fetch(apiURL, {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();
    if (responseJson.responses[0].fullTextAnnotation) {
      const detectedText = responseJson.responses[0].fullTextAnnotation.text;
      console.log("Detected Text:", detectedText);
      return detectedText;
    } else {
      console.log("No text detected");
      return "";
    }
  } catch (error) {
    console.error("Error during text recognition:", error);
    return "";
  }
}
