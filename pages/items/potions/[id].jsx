import axios from 'axios';
import Link from 'next/link';
import React from 'react';
import PropTypes from 'prop-types';
import { timeFormat, getYoutubeLink } from '../../../components/utils';
import { PotionTable } from '../../../components/Table/tableTypes';

function PotionDetail({
  potion: {
    description,
    name,
    uses,
  },
}) {
  return (
    <div className="content">
      <h1>{name}</h1>
      <p className="subtitle">
        {description}
        {' '}
        (should be description here)
      </p>
      <PotionTable data={uses} />
    </div>
  );
}

PotionDetail.propTypes = {
  potion: PropTypes.shape({
    description: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    uses: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      by: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      to: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    })),
  }).isRequired,
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/items/api/potion`);
  const paths = data.map((potion) => ({
    params: { id: potion.id.toString() },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const potion = (await axios.get(`${process.env.DB_HOST}/items/api/potion/${params.id}`)).data;
  return { props: { potion } };
}

export default PotionDetail;
