import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import ReactFrappeChart from 'react-frappe-charts';
import React from 'react';
import PropTypes from 'prop-types';
import BarChart from '../../components/Charts/bar';

function CharacterDetail({ character }) {
  const normalRolls = character.roll_counts.total - character.roll_counts.advantages
                      - character.roll_counts.disadvantages;
  const rollData = [character.roll_counts.disadvantages,
    character.roll_counts.advantages, normalRolls];
  const rollColours = ['red', 'blue', 'light-blue'];
  const rollLabels = ['Disadvantage', 'Advantage', 'Normal'];

  const insertType = (num, name, colour, colourArr, dataArr, labelArr) => {
    dataArr.splice(-1, 0, num);
    // eslint-disable-next-line no-param-reassign
    dataArr[-1] = rollData[-1] - rollData[-2];
    labelArr.splice(-1, 0, name);
    colourArr.splice(-1, 0, colour);
  };

  if (character.roll_counts.luck !== 0) insertType(character.roll_counts.luck, 'Luck', 'green', rollColours, rollData, rollLabels);
  if (character.roll_counts.fate !== 0) insertType(character.roll_counts.fate, 'Fate', 'orange', rollColours, rollData, rollLabels);
  if (character.roll_counts.decahedron !== 0) insertType(character.roll_counts.decahedron, 'Fragment of Possibility', 'purple', rollColours, rollData, rollLabels);

  return (
    <div className="content">
      <Head>
        <title>
          CRDB |
          {character.name}
        </title>
      </Head>
      <h1 className="title is-2">{character.full_name}</h1>
      <p>
        Player:
        {character.player?.full_name}
      </p>
      <p>
        Race:
        {character.race.name}
      </p>
      <p>
        Character Type:
        {character.char_type.name}
      </p>
      {character.char_type.name !== 'Non Player Character'
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
          <>
            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <div className="tile is-child box">
                  <div className="level is-mobile">
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Damage Dealt</p>
                        <p className="title">{character.damage_total}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child box">
                  <div className="level is-mobile">
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Natural 1&apos;s</p>
                        <p className="title">{character.nat_ones}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child box">
                  <div className="level is-mobile">
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Natural 20&apos;s</p>
                        <p className="title">{character.nat_twenty}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child box">
                  <div className="level is-mobile">
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">HDYWTDT</p>
                        <p className="title">{character.hdywt_count}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child box">
                  <div className="level is-mobile">
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Kills</p>
                        <p className="title">{character.kill_count}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ReactFrappeChart
              type="percentage"
              title={`Rolls (${character.roll_counts.total} total)`}
              colors={rollColours}
              barOptions={{ depth: 0 }}
              data={{
                labels: rollLabels,
                datasets: [{ values: rollData }],
              }}
            />

            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <div className="tile is-child">
                  <BarChart
                    title="Top Roll Types"
                    colors={['blue']}
                    yToolTip=" roll"
                    labels={character.top_roll_types.map((type) => type[0])}
                    datasets={[{ values: character.top_roll_types.map((type) => type[1]) }]}
                    valuesOverPoints
                  />
                </div>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child no_x_axis">
                  <BarChart
                    title="Rolls Per Episode"
                    colors={['green']}
                    xToolTip="EP "
                    yToolTip=" roll"
                    labels={[...Array(character.campaign?.length).keys()].map((x) => x + 1)}
                    datasets={[{ values: character.ep_totals?.rolls }]}
                    yMarkers={[{
                      label: 'Avg.',
                      value: character.ep_totals?.rolls.reduce((a, b) => a + b)
                        / character.appearances.length,
                      options: { labelPos: 'left' },
                    }]}
                  />
                </div>
              </div>
            </div>

            {character.top_spells.total_count > 0
            && (
            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <div className="tile is-child">
                  <BarChart
                    title={`Top Spells Cast (${character.top_spells.total_count} total)`}
                    colors={['light-blue']}
                    labels={character.top_spells.list.map((spell) => spell[0])}
                    datasets={[{ values: character.top_spells.list.map((spell) => spell[1]) }]}
                    yToolTip=" cast"
                    valuesOverPoints
                  />
                </div>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child no_x_axis">
                  <BarChart
                    title="Cast Per Epiosde"
                    colors={['light-green']}
                    xToolTip="EP "
                    yToolTip=" cast"
                    labels={[...Array(character.campaign?.length).keys()].map((x) => x + 1)}
                    datasets={[{ values: character.ep_totals?.casts }]}
                    yMarkers={[{
                      label: 'Avg.',
                      value: character.ep_totals?.casts.reduce((a, b) => a + b)
                        / character.appearances.length,
                      options: { labelPos: 'left' },
                    }]}
                  />
                </div>
              </div>

            </div>
            )}
            <div className="no_x_axis">
              <BarChart
                title="Damage Dealt Per Episode"
                colors={['blue']}
                xToolTip="Ep "
                yToolTip=" point"
                labels={[...Array(character.campaign?.length).keys()].map((x) => x + 1)}
                datasets={[{ values: character.ep_totals?.dmg_dealt }]}
                yMarkers={[{
                  label: 'Avg.',
                  value: character.ep_totals?.dmg_dealt.reduce((a, b) => a + b)
                    / character.appearances.length,
                  options: { labelPos: 'left' },
                }]}
              />
            </div>
          </>
        </TabPanel>
        <TabPanel><p>Show character roll table</p></TabPanel>
        <TabPanel>
          <h4>
            Appears in (
            {character.appearances.length}
            ):
          </h4>
          <ul>
            {character.appearances.map((appearance) => (
              <li key={appearance.episode}>
                <Link href={`/episodes/${appearance.episode}`}>
                  <a>{appearance.episode_title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </TabPanel>
        <TabPanel>
          <p>Add table of all spells cast</p>
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
  }).isRequired,
};

export async function getStaticPaths() {
  const pageOne = (await axios.get(`${process.env.DB_HOST}/characters/api/character`)).data.results;
  const pageTwo = (await axios.get(`${process.env.DB_HOST}/characters/api/character?page=2`)).data.results;
  const data = pageOne.concat(pageTwo);
  const paths = data.map((character) => ({
    params: { id: character.id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const character = (await axios.get(`${process.env.DB_HOST}/characters/api/character/${params.id}`)).data;
  return { props: { character } };
}

export default CharacterDetail;
