import Layout from 'components/Layout';
import ProductItem from 'components/ProductItem';
import { Store } from 'context/Store';
import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Shop() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const res = await axios.get('/api/shop/getData');
        setProducts(res.data.products);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  // Filter tickets out of products
  let filter = 'Ticket';
  let tickets = products?.filter((obj) => obj.productType === filter);

  const addToCartHandler = async (event, product) => {
    console.log('clicked');
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const data = product;

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added');
  };

  return (
    console.log('products: ', products),
    console.log('tickets: ', tickets),
    (
      <Layout title="Protocol.store">
        <div className="gap-4 px-4 grid grid-cols-5 text-primary mt-8">
          <div className="grid-cols-1 col-start-1">
            <h1 className="text-2xl flex items-center justify-center p-4">
              Tickets
            </h1>
            {tickets?.map((product) => (
              <ProductItem
                product={product}
                key={product.slug}
                addToCartHandler={addToCartHandler}
              ></ProductItem>
            ))}
          </div>

          <div className="grid-cols-1 col-start-2">
            <h1 className="text-2xl flex items-center justify-center p-4 ">
              Merch
            </h1>
          </div>

          <div className="grid-cols-1 col-start-5">
            <h1 className="text-2xl flex items-center justify-center p-4">
              NFTs
            </h1>
            <h1 className="flex justify-center">Coming Soon</h1>
          </div>
        </div>
      </Layout>
    )
  );
}
