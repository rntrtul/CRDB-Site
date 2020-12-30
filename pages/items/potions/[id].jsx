import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import { PotionTable } from '../../../components/Table/tableTypes';

function PotionDetail({ potion }) {
  const router = useRouter();
  if (router.isFallback) return (<div>Loading ...</div>);

  if (!potion) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }

  const { description, name, uses } = potion;
  
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
  }),
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/items/api/potion`);
  const paths = data.map((potion) => ({
    params: { id: potion.id.toString() },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  try {
    const potion = (await axios.get(`${process.env.DB_HOST}/items/api/potion/${params.id}`)).data;
    return { props: { potion } };
  } catch (err) {
    return { props: { potion: null } };
  }
}

export default PotionDetail;
