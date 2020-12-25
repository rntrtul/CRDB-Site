import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { RollTable } from '../../../components/Table/tableTypes';

function RollType({ rollType }) {
  return (
    <div className="content">
      <h1>{rollType.name}</h1>
      <RollTable
        data={rollType.rolls}
        defaultPageSize={50}
        hideRollType
        showFilter
      />
    </div>
  );
}

RollType.propTypes = {
  rollType: PropTypes.shape({
    name: PropTypes.string,
    count: PropTypes.number,
    rolls: PropTypes.array,
  }).isRequired,
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/rolls/api/rolltype`);
  const paths = data.map((type) => ({
    params: { id: type.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const rollType = (await axios.get(`${process.env.DB_HOST}/rolls/api/rolltype/${params.id}`)).data;
  return { props: { rollType } };
}

export default RollType;
