import axios from 'axios';
import Head from 'next/head';
import PropType from 'prop-types';
import React from 'react';
import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';
import ReactFrappeChart from 'react-frappe-charts';
import { SpellTable } from '../../components/Table/tableTypes';

function SpellDetail({ spell }) {
  const router = useRouter();
  if (router.isFallback) return (<div>Loading ...</div>);
  
  if (!spell) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }
  const {
    cantrip,
    casts,
    level,
    name,
    top_users,
  } = spell;
  
  let aboveCast = 0;
  casts.map(
    (casting) => casting.cast_level > level && aboveCast++,
  );
  
  return (
    <div className="content">
      <Head>
        <title>
          CRDB |
          {' '}
          {name}
        </title>
      </Head>
      <p className="title">{name}</p>
      <p className="subtitle">
        {cantrip === true && <span>Cantrip</span>}
        {cantrip === false && (
          <span>
            Level:
            {' '}
            {level}
          </span>
        )}
      </p>
      <p>
        Total casts:
        {' '}
        {casts.length}
      </p>
      <p>
        Times cast above level:
        {' '}
        {aboveCast}
      </p>
      <h5 className="heading">Top Casters:</h5>
      <ol>
        {top_users.map((rank) => (
          <li key={rank[0]}>
            {rank[0]}
            {' '}
            (
            {rank[1]}
            )
          </li>
        ))}
      </ol>
      <ReactFrappeChart
        type="percentage"
        title="Top Casters"
        data={{
          labels: top_users.map((users) => users[0]),
          datasets: [{ values: top_users.map((users) => users[1]) }],
        }}
      />
      <SpellTable
        data={casts}
        hideSpell
        title=""
      />
    </div>
  );
}

SpellDetail.propTypes = {
  spell: PropType.shape({
    cantrip: PropType.bool,
    casts: PropType.array,
    level: PropType.number,
    name: PropType.string,
    top_users: PropType.array,
  }),
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/spells/api/spell`);
  const paths = data.map((spell) => ({
    params: { id: spell.id.toString() },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  try {
    const spell = (await axios.get(`${process.env.DB_HOST}/spells/api/spell/${params.id}`)).data;
    return { props: { spell } };
  } catch (err) {
    return { props: { spell: null } };
  }
}

export default SpellDetail;
