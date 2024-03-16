import * as Tesseract from 'tesseract.js';

export const recognizeTextFromImage = async (imagePath: string) => {
    try {
        console.log(imagePath);
        const result = await Tesseract.recognize(
            imagePath,
            'eng', // Use 'rus' for Russian, 'bul' for Bulgarian, 'srp' for Serbian, etc.
            {
                logger: m => console.log(m),
            }
        );
    } catch (error) {
        console.error(error);
    }
};

// const imagePath = 'C:\\Users\\35987\\Pictures\\Screenshots\\TestImage.png';
// recognizeTextFromImage(imagePath);
