import axios from 'axios';
import React from 'react';
import Head from 'next/head';
import BarChart from "../components/Charts/bar";
import { timeFormat } from '../components/utils';
import ReactFrappeChart from "react-frappe-charts";

export default function Home({
  episodeCount,
  gameTime,
  hdywt,
  kills,
  natOne,
  natTwenty,
  rollsByEp,
  rollCount,
  rollType,
  spellsByEp,
}) {
  return (
    <>
      <Head>
        <title>CRDB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div className="content">
          <h1>Rolls: {rollCount}</h1>
          <h1>Episodes: {episodeCount}</h1>
          <h1>Length: {timeFormat(gameTime)}</h1>

          <div className="no_x_axis">
            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <div className="tile is-child">
                  <BarChart
                    title="Rolls Campaign 1"
                    colors={['blue']}
                    xToolTip="EP "
                    yToolTip=" roll"
                    labels={rollsByEp.campaign_one.map((roll) => roll[0])}
                    datasets={[{ values: rollsByEp.campaign_one.map((roll) => roll[1]) }]}
                  />
                </div>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child no_x_axis">
                  <BarChart
                    title="Spells By Episode Campaign 1"
                    colors={['green']}
                    xToolTip="EP "
                    yToolTip=" roll"
                    labels={spellsByEp.campaign_one.map((roll) => roll[0])}
                    datasets={[{ values: spellsByEp.campaign_one.map((roll) => roll[1]) }]}
                  />
                </div>
              </div>
            </div>
            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <div className="tile is-child">
                  <BarChart
                    title="Rolls Campaign 2"
                    colors={['light blue']}
                    xToolTip="EP "
                    yToolTip=" roll"
                    labels={rollsByEp.campaign_two.map((roll) => roll[0])}
                    datasets={[{ values: rollsByEp.campaign_two.map((roll) => roll[1]) }]}
                  />
                </div>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child no_x_axis">
                  <BarChart
                    title="Spells By Episode Campaign 2"
                    colors={['light-green']}
                    xToolTip="EP "
                    yToolTip=" roll"
                    labels={spellsByEp.campaign_two.map((roll) => roll[0])}
                    datasets={[{ values: spellsByEp.campaign_two.map((roll) => roll[1]) }]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="columns">
            <div className="column">
              <h2>Kills</h2>
              <ol>
                {kills.map((char) => (
                  <>
                    {char[1] !== 0 && char[1] !== null && <li>{char[0]} | {char[1]}</li>}
                  </>
                ))}
              </ol>
            </div>
            <div className="column">
              <h2>Nat ones</h2>
              <ol>
                {natOne.map((char) => (
                  <>
                    {char[1] !== 0 && char[1] !== null && <li>{char[0]} | {char[1]}</li>}
                  </>
                ))}
              </ol>
            </div>
            <div className="column">
              <h2>Nat Twenty</h2>
              <ol>
                {natTwenty.map((char) => (
                  <>
                    {char[1] !== 0 && char[1] !== null && <li>{char[0]} | {char[1]}</li>}
                  </>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const {
    // eslint-disable-next-line camelcase
    episode_count,
    game_time,
    hdywt,
    kills,
    nat_one,
    nat_twenty,
    rolls_by_ep,
    roll_count,
    roll_type,
    spells_by_ep,
  } = (await axios.get(`${process.env.DB_HOST}/rolls/api/rankings`)).data[0];

  return {
    props: {
      episodeCount: episode_count,
      gameTime: game_time,
      hdywt,
      kills,
      natOne: nat_one,
      natTwenty: nat_twenty,
      rollsByEp: rolls_by_ep,
      rollCount: roll_count,
      rollType: roll_type,
      spellsByEp: spells_by_ep,
    },
  };
}
