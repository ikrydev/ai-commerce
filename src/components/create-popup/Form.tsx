import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/solid';

import getBase64 from '@/helpers/getBase64';
import useGenerateProductDesc from '@/usecases/use-generate-product-desc';
import { addProduct } from '@/db/productService';

interface Props {
  onClose: () => void;
  onRefetch: () => void;
}

const Form = ({ onClose, onRefetch }: Props) => {
  const [imgBase64, setImgBase64] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const sessionRef = useRef();
  const { doGenerate } = useGenerateProductDesc();

  useEffect(() => {
    const initSession = async () => {
      // @ts-expect-error @todo pull window.ai type from main branch once available
      sessionRef.current = await window.ai.languageModel.create();
    };

    initSession();
  }, []);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const selectedFile = event.target.files[0];
    const newBase64 = await getBase64(selectedFile);
    setImgBase64(newBase64);

    const stream = await doGenerate(selectedFile);
    // @ts-expect-error @todo pull window.ai type from main branch once available
    for await (const chunk of stream) {
      // @todo add debounce to the function
      setDescription(prev => (prev += chunk));
    }
  };

  const handleImageDelete = async () => {
    setImgBase64('');
  };

  const handleAddProduct = async () => {
    if (!title.trim()) return alert('Title is required');

    await addProduct({ title, description, price, image: imgBase64 });

    setTitle('');
    setPrice(0);
    setDescription('');

    onRefetch();
  };

  const handleSubmit = () => {
    handleAddProduct();
    onClose();
  };

  return (
    <div>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="col-span-full">
          <label htmlFor="product-title" className="block text-sm/6 font-medium text-gray-900">
            Product Title
          </label>
          <div className="mt-2">
            <input
              autoComplete="product-title"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              id="product-title"
              name="product-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="product-price" className="block text-sm/6 font-medium text-gray-900">
            Product Price
          </label>
          <div className="mt-2">
            <input
              autoComplete="product-price"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              id="product-price"
              name="product-price"
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
            Product Image
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            {imgBase64 ? (
              <div className="grid grid-cols-2 gap-8 items-center">
                <img src={imgBase64} />
                <TrashIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" onClick={handleImageDelete} />
              </div>
            ) : (
              <div className="text-center">
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
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="product-description" className="block text-sm/6 font-medium text-gray-900">
            Product Description
          </label>
          <div className="mt-2">
            <textarea
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              defaultValue={''}
              id="product-description"
              name="product-description"
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about the product.</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900" onClick={onClose}>
          Cancel
        </button>
        {/* @todo save to db / localstorage */}
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Form;
