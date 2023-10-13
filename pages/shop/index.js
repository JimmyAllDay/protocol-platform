import Layout from 'components/Layout';
import ProductItem from 'components/ProductItem';
import { Store } from 'context/Store';
import { useContext } from 'react';
import data from 'utils/data';
import { toast } from 'react-toastify';

export default function Shop() {
  const products = data;
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (event, product) => {
    console.log('clicked');
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const data = product; //TODO: You'll need to update at least this line, once you figure out the data source (probably your CMS).

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added');
  };

  return (
    <Layout title="Protocol.shop">
      <div className="gap-4 px-4 grid grid-cols-5 text-primary mt-8">
        <div className="grid-cols-3 col-start-1">
          <h1 className="text-2xl flex items-center justify-center p-4">
            NFTs
          </h1>
          {products.nfts.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            ></ProductItem>
          ))}
        </div>
        <div className="grid-cols-1 col-start-4">
          <h1 className="text-2xl flex items-center justify-center p-4">
            Tickets
          </h1>
          {products.tickets.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            ></ProductItem>
          ))}
        </div>

        <div className="grid-cols-1 col-start-5">
          <h1 className="text-2xl flex items-center justify-center p-4 ">
            Merch
          </h1>
          {products.products.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            ></ProductItem>
          ))}
        </div>
      </div>
    </Layout>
  );
}
