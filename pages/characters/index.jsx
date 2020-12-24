import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import PropTypes from 'prop-types';

// eventually change charactype from 1 to pc (use name not int id)
const fetchData = async (url) => axios.get(url).then(
  (res) => ({
    error: false,
    characters: res.data,
  }),
).catch(() => ({
  error: true,
  characters: null,
}));

const characterEntry = (char) => (
  <li key={char.name}>
    <Link href="/characters/[id]" as={`/characters/${char.id}`}>
      <a>{char.name}</a>
    </Link>
  </li>
);

const Characters = ({ pc, npc }) => (
  <>
    <Head>
      <title>CRDB | Characters</title>
    </Head>
    <Tabs selectedTabClassName="is-active">
      <TabList className="tabs is-centered">
        <ul>
          <Tab>
            <a>{pc.name}</a>
          </Tab>
          <Tab>
            <a>{npc.name}</a>
          </Tab>
        </ul>
      </TabList>
      <TabPanel>
        <ul>
          {pc.characters
            .sort((a, b) => a.name > b.name)
            .map((char) => (characterEntry(char)))}
        </ul>
      </TabPanel>
      <TabPanel>
        <ul>
          {npc.characters
            .sort((a, b) => a.name > b.name)
            .map((char) => (characterEntry(char)))}
        </ul>
      </TabPanel>
    </Tabs>
  </>
);

Characters.propTypes = {
  pc: PropTypes.shape({
    name: PropTypes.string,
    characters: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
  }).isRequired,
  npc: PropTypes.shape({
    name: PropTypes.string,
    characters: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
  }).isRequired,
};

export const getStaticProps = async () => {
  const pc = (await fetchData(`${process.env.DB_HOST}/characters/api/charactertype/1`)).characters;
  const npc = (await fetchData(`${process.env.DB_HOST}/characters/api/charactertype/2`)).characters;
  return {
    props: { pc, npc },
  };
};

export default Characters;
