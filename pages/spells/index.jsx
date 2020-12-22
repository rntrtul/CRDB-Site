import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

// eventually change charactype from 1 to pc (use name not int id)
// change to using api (witch will call fetcher
const fetchData = async () => axios
  .get(`${process.env.DB_HOST}/spells/api/spell`)
  .then((res) => ({
    error: false,
    spells: res.data.results,
  }))
  .catch(() => ({
    error: true,
    spells: null,
  }));

const Spells = ({ spells }) => (
  <>
    <Head>
      <title>CRDB | Spells</title>
    </Head>
    <div className="content">
      <ul>
        {spells.map((spell) => (
          <li key="spell.name">
            <Link href="/spells/[id]" as={`/spells/${spell.id}`}>
              <a>{spell.name}</a>
            </Link>
            <span>
              {' '}
              (
              {spell.cast_count}
              )
            </span>
          </li>
        ))}
      </ul>
    </div>
  </>
);

Spells.propTypes = {
  spells: PropTypes.arrayOf([
    PropTypes.object,
  ]).isRequired,
};

export const getServerSideProps = async () => {
  const data = await fetchData();
  return {
    props: data,
  };
};

export default Spells;
