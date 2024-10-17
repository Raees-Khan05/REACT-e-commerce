import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null); // Changed to null for better condition checking
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = async () => {
    const product = products.find(item => item._id === productId); // Use find for better readability
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in-out duration-500 opacity-100'>
      {/* Product data */}
      <div className='flex gap-12 flex-col sm:flex-row'>
        {/* Product images */}
        <div className='flex-1 flex sm:flex-row gap-3'>
          {/* Left side images */}
          <div className='flex sm:flex-col sm:w-[18.7%] w-full overflow-x-auto sm:overflow-y-scroll'>
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
                alt=""
              />
            ))}
          </div>

          {/* Main large image on the right */}
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_dull_icon} alt="" className="w-3" />
            <span className='text-sm font-light ml-2 text-gray-500'>(4.0)</span>
          </div>
          <p className='text-xl font-medium mt-4'>{currency} {productData.price}</p>

          {/* Size Selection */}
          <div className='my-5'>
            <p className='text-sm font-medium mb-2'>Select Size</p>
            <div className='flex gap-2'>
              {['S', 'M', 'L', 'XL'].map(sizeOption => (
                <button
                  key={sizeOption}
                  className={`border rounded-lg w-10 h-10 flex items-center justify-center ${size === sizeOption ? 'bg-gray-200' : 'bg-white'}`}
                  onClick={() => setSize(sizeOption)}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)} // Add size as parameter
            className='bg-gray-900 text-white rounded-lg h-12 w-full mt-4'
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Related Products */}
      <div className='mt-10'>
        <RelatedProducts />
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-screen'>
      <p className='text-xl font-medium'>Loading...</p>
    </div>
  );
};

export default Product;
