/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <Link href={`shop/product/${product._id}`}>
      <div className="card">
        <Image
          src={product.imageUrl}
          width={300}
          height={500}
          alt={product.name}
          className="object-cover h-64 w-full rounded-t"
        />
        <div className="flex flex-col items-center justify-center p-5">
          <Link href={`/product/${product.slug}`}>
            <h2 className="text-lg">{product.name}</h2>
          </Link>
          <div className="border-b border-dark w-1/3 my-2"></div>
          <p className="mb-2">{product.brand}</p>
          <p className="my-2">${product.price}</p>
          <button
            className="secondary-button p-2"
            type="button"
            onClick={() => addToCartHandler(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </Link>
  );
}
