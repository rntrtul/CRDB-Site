import axios from 'axios';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
    <div className="content">
      <div className="columns">
        <div className="column">
          <h1>{campaignOne[0].campaign.name}</h1>
          <ul>
            {campaignOne.map((ep) => epEntry(ep))}
          </ul>
        </div>
        <div className="column">
          <h1>{campaignTwo[0].campaign.name}</h1>
          <ul>
            {campaignTwo.map((ep) => epEntry(ep))}
          </ul>
        </div>
      </div>
    </div>
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

export const getServerSideProps = async () => {
  const episodeList = (await fetchData()).episodes.results;
  const campaignOne = episodeList.filter((el) => el.campaign.num === 1);
  const campaignTwo = episodeList.filter((el) => el.campaign.num === 2);
  return {
    props: { campaignOne, campaignTwo },
    revalidate: 240,
  };
};

export default Episodes;
