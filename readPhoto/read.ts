import * as Tesseract from 'tesseract.js';

const recognizeTextFromImage = async (imagePath: string) => {
    try {
        const result = await Tesseract.recognize(
            imagePath,
            'eng+bul', // Use 'rus' for Russian, 'bul' for Bulgarian, 'srp' for Serbian, etc.
            {
                //logger: m => console.log(m),
            }
        );
        console.log("Recognized Text:", result.data.text);
    } catch (error) {
        console.error(error);
    }
};

const imagePath = 'C:\\Users\\35987\\Pictures\\Screenshots\\TestImage.png';
recognizeTextFromImage(imagePath);
