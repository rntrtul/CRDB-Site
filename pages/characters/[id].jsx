import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import React from 'react';
import PropTypes from 'prop-types';
import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { RollTable, SpellTable } from '../../components/Table/tableTypes';
import CharacterStats from '../../components/Stats/characterStats';

function CharacterDetail({ character }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading ...</div>;

  if (!character) {
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
    appearances,
    campaign,
    char_type,
    casts,
    damage_total,
    ep_totals,
    full_name,
    hdywt_count,
    kill_count,
    name,
    nat_ones,
    nat_twenty,
    player,
    race,
    rolls,
    roll_counts,
    top_roll_types,
    top_spells
  } = character;

  return (
    <div className="content">
      <Head>
        <title>
          CRDB |
          {' '}
          {name}
        </title>
      </Head>
      <h1 className="title is-2">{full_name}</h1>
      <p>
        Player:
        {' '}
        {player?.full_name}
      </p>
      <p>
        Race:
        {' '}
        {race.name}
      </p>
      <p>
        Character Type:
        {' '}
        {char_type.name}
      </p>
      {char_type.name !== 'Non Player Character'
      && (
      <Tabs selectedTabClassName="is-active">
        <TabList className="tabs is-centered">
          <ul>
            <Tab tabIndex="1">
              <a>Stats</a>
            </Tab>
            <Tab tabIndex="2">
              <a>Rolls</a>
            </Tab>
            <Tab tabIndex="3">
              <a>Appearances</a>
            </Tab>
            <Tab tabIndex="4">
              <a>Spells</a>
            </Tab>
          </ul>
        </TabList>

        <TabPanel>
          <CharacterStats
            appearances={appearances}
            campaign={campaign}
            damageTotal={damage_total}
            epTotals={ep_totals}
            hdywtCount={hdywt_count}
            killCount={kill_count}
            natOnes={nat_ones}
            natTwenty={nat_twenty}
            rollCounts={roll_counts}
            topRollTypes={top_roll_types}
            topSpells={top_spells}
          />
        </TabPanel>
        <TabPanel>
          <RollTable data={rolls} defaultPageSize={50} showFilter hideCharacter />
        </TabPanel>
        <TabPanel>
          <h4>
            Appears in (
            {appearances.length}
            ):
          </h4>
          <ul>
            {appearances.map((appearance) => (
              <li key={appearance.episode}>
                <Link href={`/episodes/${appearance.episode}`}>
                  <a>{appearance.episode_title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </TabPanel>
        <TabPanel>
          <SpellTable data={casts} defaultPageSize={50} showFilter hideCharacter />
        </TabPanel>
      </Tabs>
      )}
    </div>
  );
}

CharacterDetail.propTypes = {
  character: PropTypes.shape({
    appearances: PropTypes.arrayOf(
      PropTypes.shape({
        air_date: PropTypes.string,
        episode: PropTypes.number,
        episode_title: PropTypes.string,
        episode_num: PropTypes.number,
      }),
    ),
    campaign: PropTypes.shape({
      name: PropTypes.string,
      length: PropTypes.number,
    }),
    char_type: PropTypes.shape({ name: PropTypes.string }),
    damage_total: PropTypes.number,
    ep_totals: PropTypes.shape({
      rolls: PropTypes.arrayOf(PropTypes.number),
      casts: PropTypes.arrayOf(PropTypes.number),
      dmg_dealt: PropTypes.arrayOf(PropTypes.number),
    }),
    full_name: PropTypes.string,
    hdywt_count: PropTypes.number,
    kill_count: PropTypes.number,
    name: PropTypes.string,
    nat_ones: PropTypes.number,
    nat_twenty: PropTypes.number,
    player: PropTypes.shape({ full_name: PropTypes.string }),
    race: PropTypes.shape({ name: PropTypes.string }),
    roll_counts: PropTypes.shape({
      advantages: PropTypes.number,
      decahedron: PropTypes.number,
      disadvantages: PropTypes.number,
      fate: PropTypes.number,
      luck: PropTypes.number,
      total: PropTypes.number,
    }),
    top_roll_types: PropTypes.arrayOf(PropTypes.array),
    top_spells: PropTypes.shape({
      total_count: PropTypes.number,
      list: PropTypes.arrayOf(PropTypes.array),
    }),
  }),
};

export async function getStaticPaths() {
  const { data } = (await axios.get(`${process.env.DB_HOST}/characters/api/character`));
  const paths = data.map((character) => ({
    params: { id: character.id.toString() },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  try {
    const character = (await axios.get(`${process.env.DB_HOST}/characters/api/character/${params.id}`)).data;
    return { props: { character } };
  } catch (err) {
    return { props: { character: null } };
  }
}

export default CharacterDetail;
