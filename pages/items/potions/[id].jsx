import axios from 'axios';
import Link from 'next/link';
import React from 'react';
import PropTypes from 'prop-types';
import { timeFormat, getYoutubeLink } from '../../../components/helpers';

function PotionDetail({ potion }) {
  return (
    <div className="content">
      <h1>{potion.name}</h1>
      <p className="subtitle">
        {potion.description}
        {' '}
        (should be description here)
      </p>
      <h4>
        All Uses (
        {potion.uses.length}
        ):
      </h4>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <td>Episode</td>
            <td>Time Stamp</td>
            <td>By</td>
            <td>To</td>
            <td>Notes</td>
          </tr>
        </thead>
        <tbody>
          {potion.uses.map((use) => (
            <tr>
              <td>
                <Link href="/episodes/[id]" as={`/episodes/${use.episode.id}`}>
                  <a>
                    C
                    {use.episode.campaign.num}
                    E
                    {use.episode.num}
                  </a>
                </Link>
              </td>
              <td>
                <a href={getYoutubeLink(use.timestamp, use.notes, use.episode.vod_links)}>
                  {timeFormat(use.timestamp)}
                </a>
              </td>
              <td>
                <Link href="/characters/[id]" as={`/characters/${use.by.id}`}>
                  <a>{use.by.name}</a>
                </Link>
              </td>
              <td>
                <Link href="/characters/[id]" as={`/characters/${use.to.id}`}>
                  <a>{use.to.name}</a>
                </Link>
              </td>
              <td>{use.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

PotionDetail.propTypes = {
  potion: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    uses: PropTypes.array,
  }).isRequired,
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/items/api/potion`);
  const paths = data.results.map((potion) => ({
    params: { id: potion.id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const potion = (await axios.get(`${process.env.DB_HOST}/items/api/potion/${params.id}`)).data;
  return { props: { potion }};
}

export default PotionDetail;
