import useImageToText from '../../hooks/use-image-to-text';

const useValidateReviewImage = () => {
  const { session, isEligible } = useImageToText();

  const handleValidate = async (
    title: string,
    imgReview: File | Blob,
    onSuccess: () => void,
  ) => {
    try {
      if (isEligible && session) {
        try {
          const imageBitmap = await createImageBitmap(imgReview);

          // @ts-ignore
          const result = await session?.prompt([
            `Analyze the image provided. what inside the image and check is the image relevant with the product with title "${title}. answer with percentegae 1-100%. avoid compare color of product and answer with this template valid JSON { score: "", reason: "" }"`,
            { type: 'image', content: imageBitmap },
          ]);

          console.log('Result: ' + result);

          return result;
        } catch (bitmapError) {
          console.error('ImageBitmap error:', bitmapError);
          return { score: 0, reason: '' };
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      return { score: 0, reason: '' };
    }
  };

  return [handleValidate];
};

export default useValidateReviewImage;
