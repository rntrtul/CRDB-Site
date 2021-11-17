import axios from 'axios';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Tab, Tabs, TabList, TabPanel
} from 'react-tabs';
import PropTypes from 'prop-types';

const fetchData = async () => axios.get(`${process.env.DB_HOST}/episodes/`)
  .then(
    (res) =>
      ({
        error: false,
        episodes: res.data
      })
  )
  .catch(() => ({
    error: true,
    episodes: null
  }));

const epEntry = (ep) => (
  <li key={ep.id}>
    EP
    {' '}
    {ep.num}
    {' '}
    <Link href="/episodes/[id]" as={`/episodes/${ep.id}`}>
      <a>{ep.title}</a>
    </Link>
    {ep.is_live === true && <span className="tag is-light">Live</span>}
  </li>
);

const Episodes = ({ campaigns }) => (
  <>
    <Head>
      <title>CRDB | Episodes</title>
    </Head>
    <Tabs selectedTabClassName="is-active">
      <TabList className="tabs is-centered">
        <ul>
          {campaigns.map((campaign) =>
            <Tab>
              <a>{campaign[0].campaign.name}</a>
            </Tab>
          )}
        </ul>
      </TabList>
      {campaigns.map((campaign) =>
        <TabPanel>
          <ul>
            {campaign.map((ep) => epEntry(ep))}
          </ul>
        </TabPanel>
      )}
    </Tabs>
  </>
);

Episodes.propTypes = {
  campaigns: PropTypes.arrayOf(PropTypes.shape({
    campaign: PropTypes.shape({
      name: PropTypes.string,
      num: PropTypes.number
    }),
    length: PropTypes.number,
    title: PropTypes.string
  })).isRequired
};

export const getStaticProps = async () => {
  const {
    error,
    episodes
  } = (await fetchData());

  const campaigns = [];

  if (!error) {
    // todo: filter all campaigns properly
    campaigns.push(episodes.filter((el) => el.campaign.num === 1));
    campaigns.push(episodes.filter((el) => el.campaign.num === 2));
  }
  return {
    props: { campaigns },
    revalidate: 10800
  };
};

export default Episodes;
