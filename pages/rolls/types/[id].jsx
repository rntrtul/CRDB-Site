import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';

function RollType({ rollType }) {
  return (
    <div className="content">
      <h1>{rollType.name}</h1>
      <h3>
        Count:
        {rollType.count}
      </h3>
    </div>
  );
}

RollType.propTypes = {
  rollType: PropTypes.shape({
    name: PropTypes.string,
    count: PropTypes.number,
  }).isRequired,
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/rolls/api/rolltype`);
  const paths = data.results.map((type) => ({
    params: { id: type.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const rollType = (await axios.get(`${process.env.DB_HOST}/rolls/api/rolltype/${params.id}`)).data;
  return { props: { rollType } };
}

export default RollType;
