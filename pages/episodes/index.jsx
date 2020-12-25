import axios from 'axios';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import PropTypes from 'prop-types';

const fetchData = async () => axios.get(`${process.env.DB_HOST}/episodes/api/episode`).then(
  (res) => ({
    error: false,
    episodes: res.data,
  }),
).catch(() => ({
  error: true,
  episodes: null,
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

const Episodes = ({ campaignOne, campaignTwo }) => (
  <>
    <Head>
      <title>CRDB | Episodes</title>
    </Head>
    <Tabs selectedTabClassName="is-active">
      <TabList className="tabs is-centered">
        <ul>
          <Tab>
            <a>{campaignOne[0].campaign.name}</a>
          </Tab>
          <Tab>
            <a>{campaignTwo[0].campaign.name}</a>
          </Tab>
        </ul>
      </TabList>
      <TabPanel>
        <ul>
          {campaignOne.map((ep) => epEntry(ep))}
        </ul>
      </TabPanel>
      <TabPanel>
        <ul>
          {campaignTwo.map((ep) => epEntry(ep))}
        </ul>
      </TabPanel>
    </Tabs>
  </>
);

Episodes.propTypes = {
  campaignOne: PropTypes.arrayOf(PropTypes.shape({
    campaign: PropTypes.shape({
      name: PropTypes.string,
      num: PropTypes.number,
    }),
    length: PropTypes.number,
    title: PropTypes.string,
  })).isRequired,
  campaignTwo: PropTypes.arrayOf(PropTypes.shape({
    campaign: PropTypes.shape({
      name: PropTypes.string,
      num: PropTypes.number,
    }),
    length: PropTypes.number,
    title: PropTypes.string,
  })).isRequired,
};

export const getStaticProps = async () => {
  const episodeList = (await fetchData()).episodes;
  const campaignOne = episodeList.filter((el) => el.campaign.num === 1);
  const campaignTwo = episodeList.filter((el) => el.campaign.num === 2);
  return {
    props: { campaignOne, campaignTwo },
  };
};

export default Episodes;
