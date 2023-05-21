import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Error, SpecsLoader } from '../../commonComponents';
import { getSingleProductService } from '../../Services/services';
import styles from './SingleProductPage.module.css';
import { Price, Title } from '../../components';
import { calculateDiscountPercent } from '../../utils/utils';
import { AiFillStar } from 'react-icons/ai';
import errorImg from '../../assets/jethalal-error.png';

const SingleProductPage = () => {
  const { productId } = useParams();

  const [singleProductState, setSingleProductState] = useState({
    isSinglePageLoading: true,
    singleProduct: [],
    isSinglePageError: false,
  });

  const fetchSingleProduct = async () => {
    setSingleProductState({ ...singleProductState, isSinglePageLoading: true });

    try {
      const product = await getSingleProductService(productId);

      setSingleProductState({
        isSinglePageLoading: false,
        singleProduct: product,
        isSinglePageError: false,
      });
    } catch (error) {
      console.error(error.response);

      setSingleProductState({
        ...singleProductState,
        isSinglePageLoading: false,
        isSinglePageError: true,
      });
    }
  };

  useEffect(() => {
    fetchSingleProduct();
    // eslint-disable-next-line
  }, []);

  const { isSinglePageLoading, singleProduct, isSinglePageError } =
    singleProductState;

  if (isSinglePageLoading) {
    return (
      <main className='half-page grid-center margin-top-2'>
        <SpecsLoader text='Loading Product...' />;
      </main>
    );
  }

  if (isSinglePageError) {
    return <Error errorText='Error: Product Not Found' />;
  }

  const {
    _id,
    name,
    price,
    originalPrice,
    image,
    colors,
    company,
    description,
    category,
    isShippingAvailable,
    inStock,
    reviewCount,
    stars,
  } = singleProduct;

  const discountPercent = calculateDiscountPercent(price, originalPrice);

  return (
    <main className={`container half-page ${styles.productPageCenter}`}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} />
      </div>

      <div className={styles.productContent}>
        <h3 className='primary-color-text'>{name}</h3>
        <div className={styles.userReview}>
          <span className={styles.rating}>
            {stars} <AiFillStar />
          </span>
          <p>({reviewCount} customer reviews)</p>
        </div>

        <div className={styles.price}>
          <Price amount={price} />
          {discountPercent > 0 && (
            <>
              <Price amount={originalPrice} />
              <span className={styles.discount}> ({discountPercent}% off)</span>
            </>
          )}
        </div>

        <p className={styles.desc}>{description}</p>

        <div className={styles.row}>
          <span>Availability:</span>
          <p>{inStock ? 'In Stock' : 'Out Of Stock'}</p>
        </div>

        <div className={styles.row}>
          <span>Shipping Available:</span>
          <p>{isShippingAvailable ? 'Yes' : 'No'}</p>
        </div>

        <div className={styles.row}>
          <span>Category:</span>
          <p>{category}</p>
        </div>

        <div className={styles.row}>
          <span>Company:</span>
          <p>{company}</p>
        </div>

        <div className={styles.row}>
          <span>Color{colors.length > 1 && 's'}:</span>
          <div className={styles.colorsContainer}>
            {colors.map((color, index) => (
              <div key={index} style={{ background: color }}></div>
            ))}
          </div>
        </div>

        <hr />
        {/* btn-activated & btn-hipster */}
        <div className='btn-container'>
          <button className='btn btn-padding-desktop' disabled={!inStock}>
            Add To Cart {/* Go to Cart */}
          </button>

          <button
            className='btn btn-hipster btn-padding-desktop'
            disabled={!inStock}
          >
            Add To Wishlist {/* Go to Wishlist */}
          </button>
        </div>
      </div>
    </main>
  );
};

export default SingleProductPage;