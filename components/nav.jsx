import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

const Nav = () => {
  const router = useRouter();
  return (
    <nav className="navbar is-dark">
      <div className="navbar-start">
        <Link href="/">
          <a className={`navbar-item is-expanded ${router.pathname === '/' ? 'is-active' : ''}`}>Home</a>
        </Link>
        <Link href="/episodes">
          <a className={`navbar-item is-expanded ${router.pathname.startsWith('/episodes') ? 'is-active' : ''}`}>Episodes</a>
        </Link>
        <Link href="/rolls">
          <a className={`navbar-item is-expanded ${router.pathname.startsWith('/rolls') ? 'is-active' : ''}`}>Rolls</a>
        </Link>
        <Link href="/characters">
          <a className={`navbar-item is-expanded ${router.pathname.startsWith('/characters') ? 'is-active' : ''}`}>Characters</a>
        </Link>
        <Link href="/spells">
          <a className={`navbar-item is-expanded ${router.pathname.startsWith('/spells') ? 'is-active' : ''}`}>Spells</a>
        </Link>
        <Link href="/items">
          <a className={`navbar-item is-expanded ${router.pathname.startsWith('/items') ? 'is-active' : ''}`}>Items</a>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
