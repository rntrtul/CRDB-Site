import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import { RollTable } from '../../../components/Table/tableTypes';

function RollType({ rollType }) {
  const router = useRouter();
  if (router.isFallback) return (<div>Loading ...</div>);

  if (!rollType) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }

  const { rolls, name } = rollType;
  
  return (
    <div className="content">
      <h1>{name}</h1>
      <RollTable
        data={rolls}
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
  }),
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/rolls/api/rolltype`);
  const paths = data.map((type) => ({
    params: { id: type.id.toString() },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  try {
    const rollType = (await axios.get(`${process.env.DB_HOST}/rolls/api/rolltype/${params.id}`)).data;
    return { props: { rollType } };
  } catch(err){
    return { props: { rollType: null } };
  }
}

export default RollType;
