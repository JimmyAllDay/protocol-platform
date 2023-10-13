import React, { useState, useContext, useEffect } from 'react';
import { Store } from 'context/Store';
import Link from 'next/link';
import { Icon } from '@iconify/react'; //TODO: Use the same icon package for all icons if possible

export default function Cart() {
  const { state, dispatch } = useContext(Store);

  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const [hover, setHover] = useState(false);

  const handleMouseOver = () => {
    setHover(true);
  };

  const handleMouseExit = () => {
    setHover(false);
  };
  return (
    <Link
      href="/cart"
      className="text-2xl flex"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseExit}
    >
      <div className="relative">
        {hover ? (
          <Icon icon="clarity:shopping-cart-solid" />
        ) : (
          <Icon icon="clarity:shopping-cart-line" />
        )}
      </div>
      <div className="w-[20px] flex flex-col">
        <div className={`text-base items-center justify-center`}>
          <span
            style={{ position: 'relative', top: '10%' }}
            className={`${hover ? 'border-b' : 'text-primary'} mx-auto`}
          >
            {cartItemsCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
