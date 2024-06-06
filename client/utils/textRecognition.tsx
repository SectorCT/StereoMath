import { ImagePickerAsset } from "expo-image-picker";

export default async function recognizeTextFromImage(
  base64Image: ImagePickerAsset | string | null | undefined
) {
  const ServerUrl = process.env.EXPO_PUBLIC_API_URL;

  try {
    const response = await fetch(`${ServerUrl}/recognize_text`, {
      method: "POST",
      body: JSON.stringify({
        image: base64Image,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();
    console.log(responseJson)
    if (responseJson.text) {
      const detectedText = responseJson.text;
      console.log("Detected Text:", detectedText.replace(/\n/g, " ").trim());
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
