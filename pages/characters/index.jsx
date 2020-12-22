import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import PropTypes from 'prop-types';

// eventually change charactype from 1 to pc (use name not int id)
const fetchData = async () => axios.get(`${process.env.DB_HOST}/characters/api/charactertype/1`).then(
  (res) => ({
    error: false,
    characters: res.data,
  }),
).catch(() => ({
  error: true,
  characters: null,
}));

const Characters = ({ characters }) => (
  <>
    <Head>
      <title>CRDB | Characters</title>
    </Head>
    <div className="tabs">
      <ul>
        <li className="is-active">
          <a>PC</a>
        </li>
        <li>
          <a>NPC</a>
        </li>
      </ul>
    </div>
    <div className="content">
      <ul>
        {characters.characters.sort((a, b) => a.name > b.name).map((char) => (
          <li key={char.name}>
            <Link href="/characters/[id]" as={`/characters/${char.id}`}>
              <a>{char.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </>
);

Characters.propTypes = {
  characters: PropTypes.shape({
    characters: PropTypes.array,
  }).isRequired,
};

export const getServerSideProps = async () => {
  const data = await fetchData();
  return {
    props: data,
  };
};

export default Characters;
