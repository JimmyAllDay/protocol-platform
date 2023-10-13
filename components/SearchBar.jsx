import { useEffect, useState, useRef } from 'react';
import Router from 'next/router';

export default function SearchBar({ searchHandler }) {
  const [disabled, setDisabled] = useState(false);

  const headingRef = useRef(null);

  function pushRoute() {
    const path = Router.pathname;
    if (path !== '/search') {
      setDisabled(true); //disables input field until page render complete
      Router.push('/search');
    }
  }

  const focusSearchBar = () =>
    Router.pathname === '/search' && headingRef.current.focus();

  useEffect(() => {
    focusSearchBar();
  }, []);

  return (
    <div className="w-3/4 flex">
      <input
        ref={headingRef}
        type="search"
        placeholder="Search"
        className="w-full input-field border-dark"
        onClick={pushRoute}
        onChange={(e) => {
          searchHandler(e.target.value);
        }}
        disabled={disabled}
      />
    </div>
  );
}
