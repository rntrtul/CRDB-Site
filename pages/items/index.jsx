import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';

const Items = ({ potions, weapons }) => (
  <>
    <Head>
      <title>CRDB | Items</title>
    </Head>
    <div className="content">
      <Tabs selectedTabClassName="is-active">
        <TabList>
          <div className="tabs is-centered">
            <ul>
              <Tab>
                <li>
                  <a>Weapons</a>
                </li>
              </Tab>
              <Tab>
                <li>
                  <a>Potions</a>
                </li>
              </Tab>
            </ul>
          </div>
        </TabList>

        <TabPanel>
          <ul>
            {weapons.map((weapon) => (
              <li key={weapon.id}>
                <Link href="items/weapons/[id]" as={`/items/weapons/${weapon.id}`}>
                  <a>{weapon.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </TabPanel>

        <TabPanel>
          <ul>
            {potions.map((potion) => (
              <li key={potion.id}>
                <Link href="/items/potions/[id]" as={`/items/potions/${potion.id}`}>
                  <a>{potion.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </TabPanel>
      </Tabs>
    </div>
  </>
);

Items.propTypes = {
  potions: PropTypes.shape({
    results: PropTypes.array,
  }).isRequired,
  weapons: PropTypes.shape({
    results: PropTypes.array,
  }).isRequired,
};

const fetchData = async (url) => axios.get(url).then(
  (res) => ({
    error: false,
    data: res.data,
  }),
).catch(() => ({
  error: true,
  data: null,
}));

export const getStaticProps = async () => {
  const potions = (await fetchData(`${process.env.DB_HOST}/items/api/potion`)).data;
  const weapons = (await fetchData(`${process.env.DB_HOST}/items/api/weapon`)).data;
  return { props: { potions, weapons } };
};

export default Items;
