import { ChangeEvent, useMemo, useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/24/solid';

import Loader from '@/components/loader';

import cx from '@/helpers/cx';
import useValidateReviewImage from '@/usecases/use-validate-review-image';

const reviews = [
  {
    name: 'Leslie Alexander',
    star: '4',
    imageUrl:
      'https://images.tokopedia.net/img/cache/600/bjFkPX/2022/5/24/acb470ee-2629-48c0-ac05-4adc864d3b5d.jpg.webp?ect=4g',
    comment: 'Mantap. Murah. Berfungsi dengan baik',
  },
  {
    name: 'Leslie Alexander',
    star: '4',
    imageUrl:
      'https://images.tokopedia.net/img/cache/600/bjFkPX/2022/5/24/acb470ee-2629-48c0-ac05-4adc864d3b5d.jpg.webp?ect=4g',
    comment: 'Mantap. Murah. Berfungsi dengan baik',
  },
];

const TRESHOLD = 75;

interface Props {
  productTitle: string;
}

const ProductReview = ({ productTitle }: Props) => {
  const [handleValidate] = useValidateReviewImage();
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState({
    name: '',
    star: 0,
    comment: '',
    imageUrl: null,
    imageRelevancy: {
      score: -1,
      reason: '',
      isByPass: false,
    },
  });

  const handleBypassImageChecker = (val = false) => {
    setReview(prev => ({
      ...prev,
      imageRelevancy: {
        ...prev.imageRelevancy,
        isByPass: val,
      },
    }));
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    handleBypassImageChecker(false);

    const previewImageEl = document.getElementById('preview-image') as HTMLImageElement;
    const uploadContainerEl = document.getElementById('upload-container') as HTMLDivElement;
    const fileUploadEl = document.getElementById('file-upload') as HTMLInputElement;

    // loading state
    uploadContainerEl.style.display = 'none';
    previewImageEl.style.display = 'none';
    setLoading(true);
    // end loading state

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target) {
          previewImageEl.src = String(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      const imageFile = fileUploadEl.files?.[0];

      if (imageFile) {
        // @ts-ignore
        const result = await handleValidate({
          title: productTitle,
          img: imageFile,
          onSuccess: ({ score, reason }) => {
            console.log({
              score,
              reason,
            });

            setReview(prev => ({
              ...prev,
              imageRelevancy: {
                ...prev.imageRelevancy,
                score,
                reason,
              },
            }));

            previewImageEl.style.display = 'block';
            uploadContainerEl.style.display = 'none';
            setLoading(false);
          },
        });

        console.log(result);
      }
    } else {
      uploadContainerEl.style.display = 'block';
      previewImageEl.style.display = 'none';
      setLoading(false);
    }
  };

  const belowTreshold = useMemo(
    () => review.imageRelevancy.score !== -1 && review.imageRelevancy.score < TRESHOLD,
    [review.imageRelevancy.score],
  );

  const handleUploadAgain = () => {
    const fileUploadEl = document.getElementById('file-upload') as HTMLInputElement;

    fileUploadEl.click();
  };

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Submit Review</h2>

      <form>
        <div className="mt-4 grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-6">
          <div className="col-span-full">
            {!loading && !review.imageRelevancy.isByPass && belowTreshold && (
              <div className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4" role="alert">
                <p>
                  The image has been detected as not relevant to the product being reviewed. Please upload another image
                  related to the product you want to review.
                </p>
                <button
                  onClick={() => handleBypassImageChecker(true)}
                  className="mt-4 cursor-pointer text-yellow-600 font-bold"
                >
                  I am sure my image is correct!
                </button>
              </div>
            )}
            <div
              onClick={handleUploadAgain}
              className="cursor-pointer mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
            >
              {loading && (
                <div className="text-center relative w-25 h-25">
                  <Loader />
                </div>
              )}

              <div id="upload-container" className="text-center">
                <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                <div className="mt-4 flex text-sm/6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>

              <img style={{ display: 'none' }} className="rounded-2xl" width={300} id="preview-image"></img>
            </div>
          </div>

          <div className="sm:col-span-4">
            <div className="w-full flex mt-2 mb-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <StarIcon
                  onClick={() => {
                    setReview(prev => {
                      return {
                        ...prev,
                        star: prev.star === rating ? 0 : rating,
                      };
                    });
                  }}
                  key={rating}
                  aria-hidden="true"
                  className={cx(review.star >= rating ? 'text-gray-900' : 'text-gray-200', 'size-8 shrink-0')}
                />
              ))}
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="comment" className="block text-sm/6 font-medium text-gray-900">
              Comment
            </label>
            <div className="mt-2">
              <textarea
                id="comment"
                name="comment"
                rows={3}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                defaultValue={''}
              />
            </div>
          </div>
        </div>

        <button
          disabled={!review.imageRelevancy.isByPass && belowTreshold}
          className={`${!review.imageRelevancy.isByPass && belowTreshold ? 'disabled:bg-gray-500 cursor-not-allowed opacity-50' : 'bg-blue-500 text-white shadow-xs hover:bg-blue-500 focus-visible:outline-blue-600 cursor-pointer'} mt-4 w-full rounded-md px-3 py-2 text-sm font-semibold  focus-visible:outline-2 focus-visible:outline-offset-2 `}
        >
          Submit Review
        </button>
      </form>
      <ul role="list" className="divide-y divide-gray-100">
        {reviews.map((review, index) => (
          <li key={index} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <img alt="" src={review.imageUrl} className="size-24 flex-none rounded-md bg-gray-50" />
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">{review.name}</p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">{review.comment}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProductReview;
