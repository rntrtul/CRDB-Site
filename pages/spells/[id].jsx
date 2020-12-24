import axios from 'axios';
import Head from 'next/head';
import PropType from 'prop-types';
import React from 'react';
import { SpellTable } from '../../components/Table/tableTypes';
import ReactFrappeChart from "react-frappe-charts";

function SpellDetail({ spell }) {
  let aboveCast = 0;
  spell.casts.map(
    (casting) => casting.cast_level > spell.level && aboveCast++,
  );
  return (
    <div className="content">
      <Head>
        <title>
          CRDB |
          {spell.name}
        </title>
      </Head>
      <p className="title">{spell.name}</p>
      <p className="subtitle">
        {spell.cantrip === true && <span>Cantrip</span>}
        {spell.cantrip === false && (
        <span>
          Level:
          {spell.level}
        </span>
        )}
      </p>
      <p>
        Total casts:
        {spell.casts.length}
      </p>
      <p>
        Times cast above level:
        {aboveCast}
      </p>
      <h5 className="heading">Top Casters:</h5>
      <ol>
        {spell.top_users.map((rank) => (
          <li>
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
          labels: spell.top_users.map((users) => users[0]),
          datasets: [{ values: spell.top_users.map((users) => users[1]) }],
        }}
      />
      <SpellTable data={spell.casts} />
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
  }).isRequired,
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/spells/api/spell`);
  const paths = data.map((spell) => ({
    params: { id: spell.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const spell = (
    await axios.get(`${process.env.DB_HOST}/spells/api/spell/${params.id}`)).data;

  return { props: { spell }};
}

export default SpellDetail;
