import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const fetchData = async () => axios
  .get(`${process.env.DB_HOST}/spells/api/spell`)
  .then((res) => ({
    error: false,
    spells: res.data,
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
          <li key={spell.name}>
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
  spells: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    cantrip: PropTypes.bool,
    cast_count: PropTypes.number,
    level: PropTypes.number,
    name: PropTypes.string,
  })).isRequired,
};

export const getStaticProps = async () => {
  const data = await fetchData();
  return {
    props: data,
    revalidate: 10800,
  };
};

export default Spells;
