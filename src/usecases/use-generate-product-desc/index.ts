import useImageToText from '../../hooks/use-image-to-text';

const useGenerateProductDesc = () => {
  const { session, isEligible } = useImageToText();

  const doGenerate = async (selectedFile: File): Promise<ReadableStream<string>> => {
    if (!isEligible || !session) {
      return new ReadableStream<string>();
      ;
    }

    try {
      const imageBitmap = await createImageBitmap(selectedFile);
      // @ts-expect-error @todo pull window.ai type from main branch once available
      return await session.promptStreaming([
        'describe this image with atleast 100 characters, make it appealing as a product description that you will sell on market',
        { type: 'image', content: imageBitmap },
      ])
    } catch (error) {
      console.error(error);
      return new ReadableStream<string>();
    }
  };

  return { doGenerate };
};

export default useGenerateProductDesc;
