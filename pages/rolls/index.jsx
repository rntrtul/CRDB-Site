import axios from 'axios';
import Head from 'next/head';
import React from 'react';
import PropTypes from 'prop-types';
import { RollTable } from '../../components/Table/tableTypes';

const fetchData = async () => axios
  .get(`${process.env.DB_HOST}/rolls/api/roll`)
  .then((res) => ({
    error: false,
    rolls: res.data,
  }))
  .catch(() => ({
    error: true,
    rolls: null,
  }));

const RollsList = ({ rolls }) => (
  <>
    <Head>
      <title>CRDB | Rolls</title>
    </Head>
    <RollTable data={rolls} showFilter defaultPageSize={100} />
  </>
);

RollsList.propTypes = {
  rolls: PropTypes.shape({
    results: PropTypes.array,
  }).isRequired,
};

export const getStaticProps = async () => {
  const data = await fetchData();
  return {
    props: data,
  };
};

export default RollsList;
