import './layout.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Nav from './nav';

export default function Layout({ children, settings = {} }) {
  return (
    <>
      <Nav settings={settings} />

      <div className="section">
        {children}
      </div>

      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            All data is from
            {' '}
            <a href="https://www.critrolestats.com/">Crit Role Stats</a>
          </p>
        </div>
      </footer>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  settings: PropTypes.objectOf(),
};
