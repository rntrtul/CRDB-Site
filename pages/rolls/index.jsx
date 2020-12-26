import axios from 'axios';
import Head from 'next/head';
import React from 'react';
import PropTypes from 'prop-types';
import { RollTable } from '../../components/Table/tableTypes';

const fetchData = async (url) => axios
  .get(url)
  .then((res) => ({
    error: false,
    rolls: res.data,
  }))
  .catch(() => ({
    error: true,
    rolls: null,
  }));

const RollsList = ({ rolls = [] }) => (
  <div className="content">
    <Head>
      <title>CRDB | Rolls</title>
    </Head>
    <h1>All Rolls</h1>
    <RollTable data={rolls} showFilter defaultPageSize={50} />
  </div>
);

RollsList.propTypes = {
  rolls: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
  })).isRequired,
};

export const getStaticProps = async () => {

  let data = await fetchData(`${process.env.DB_HOST}/rolls/api/roll`);
  let rolls = data.rolls.results;

  while (data.rolls.next) {
    // eslint-disable-next-line no-await-in-loop
    data = await fetchData(data.rolls.next);
    rolls = rolls.concat(data.rolls.results);
  }

  return {
    props: { rolls },
  };
};

export default RollsList;
