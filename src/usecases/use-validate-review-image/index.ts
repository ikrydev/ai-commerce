import useImageToText from '../../hooks/use-image-to-text';

const useValidateReviewImage = () => {
  const { session, isEligible } = useImageToText();

  const handleValidate = async ({
    title,
    img,
    onSuccess,
  }: {
    title: string;
    img: File | Blob;
    onSuccess: ({ score, reason }: { score: number; reason: string }) => void;
  }) => {
    try {
      if (isEligible && session) {
        try {
          let jsonResult = { score: 0, reason: 'error' };
          const imageBitmap = await createImageBitmap(img);

          // @ts-ignore
          const result = await session?.prompt([
            `Analyze the image provided. what inside the image and check is the image stricly relevant with the product with title "${title}. answer with percentegae 1-100%. avoid compare color of product and answer with object valid JSON only : { score: "", reason: "" }"`,
            { type: 'image', content: imageBitmap },
          ]);

          try {
            jsonResult = JSON.parse(result);
          } catch (error) {
            jsonResult = { score: 0, reason: 'error' };
          }

          console.log('Result: ' + result);

          typeof onSuccess === 'function' &&
            onSuccess({
              score: Number.isNaN(jsonResult.score) ? 0 : Number(jsonResult.score),
              reason: jsonResult.reason || '',
            });

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
