import { useEffect, useRef, useState } from 'react';

interface UseImageToTextReturn {
  session: React.RefObject<any>;
  isEligible: boolean;
}

const useImageToText = (): UseImageToTextReturn => {
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const session = useRef<any>(null);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        //@ts-ignore
        const availability = await ai.languageModel.availability();
        const eligibilityStatus = availability !== 'no';

        if (eligibilityStatus) {
          if (!['available', 'readily'].includes(availability)) {
            console.log('= Downloading Model =');
            //@ts-ignore
            await ai.languageModel.create();
          }

          //@ts-ignore
          session.current = await ai.languageModel.create();

          setIsEligible(true);
        } else {
          setIsEligible(false);
        }
      } catch (error) {
        setIsEligible(false);
      }
    };

    checkEligibility();
  }, []);

  return { session: session.current, isEligible };
};

export default useImageToText;
