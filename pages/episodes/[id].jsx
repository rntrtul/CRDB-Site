import React from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import ReactFrappeChart from 'react-frappe-charts';
import PropTypes from 'prop-types';
import { GrYoutube, GrLinkNext, GrLinkPrevious } from 'react-icons/gr';
import { FaTwitch } from 'react-icons/fa';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { RollTable, SpellTable } from '../../components/Table/tableTypes';
import { getYoutubeLink, timeFormat } from '../../components/utils';

function EpisodeDetail({
  episode: {
    air_date,
    attendance,
    appearances,
    campaign,
    casts,
    combat_encounters,
    description,
    first_half_end,
    first_half_start,
    length,
    level_ups,
    second_half_start,
    second_half_end,
    next_episode,
    num,
    prev_episode,
    rolls,
    title,
    vod_links,
  },
}) {
  const rollsDisplay = rolls.map((roll) => ({
    timestamp: roll.timestamp,
    character: roll.character,
    roll_type: roll.roll_type,
    natural_value: roll.natural_value,
    final_value: roll.final_value,
    notes: roll.notes,
    damage: roll.damage,
    kill_count: roll.kill_count,
    vod_links,
  }));

  const castsDisplay = casts.map((cast) => ({
    timestamp: cast.timestamp,
    spell: cast.spell,
    character: cast.character,
    cast_level: cast.cast_level,
    notes: cast.notes,
    vod_links,
  }));

  return (
    <>
      <Head><title>{title}</title></Head>
      <div className="content is-medium">
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          {prev_episode &&
            <Link href="/episodes/[id]" as={`/episodes/${prev_episode}`}>
              <a>
                <GrLinkPrevious size={32} />
              </a>
            </Link>
          }
          <h1>
            {title}
            {' '}
            (C
            {campaign.num}
            E
            {num}
            )
          </h1>
          {next_episode &&
            <Link href="/episodes/[id]" as={`/episodes/${next_episode}`}>
              <a>
                <GrLinkNext size={32} />
              </a>
            </Link>
          }
        </div>
        <a
          href={getYoutubeLink(0, '', vod_links)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GrYoutube style={{ color: '#FF0000' }} size={32} />
        </a>
        <a href="#" className="ml-4">
          <FaTwitch style={{ color: '#6441A4' }} size={29} />
        </a>


        <h4>{air_date}</h4>
        <p className="is-medium">{description}</p>
        <p>
          Length:
          {' '}
          {timeFormat(length)}
        </p>
      </div>

      <div className="content">
        <Tabs selectedTabClassName="is-active">
          <TabList className="tabs is-centered">
            <ul>
              <Tab>
                <a>Info</a>
              </Tab>
              <Tab>
                <a>Spells Cast</a>
              </Tab>
              <Tab>
                <a>Rolls</a>
              </Tab>
            </ul>
          </TabList>
          <TabPanel>
            <ReactFrappeChart
              type="percentage"
              title="Time Breakdown"
              colors={['dark-grey', 'blue', 'dark-grey', 'blue', 'dark-grey']}
              barOptions={{depth: 0}}
              tooltipOptions={{
                formatTooltipX: (d) => d,
                formatTooltipY: (d) => d,
              }}
              data={{
                labels: ['Announcements', 'First Half', 'Break', 'Second Half', 'End'],
                datasets: [{
                  values:
                    [first_half_start,
                      first_half_end - first_half_start,
                      second_half_start - first_half_end,
                      second_half_end - second_half_start,
                      length - second_half_end],
                }],
              }}
            />

            <p>
              Break length:
              {' '}
              {timeFormat(second_half_start - first_half_end)}
            </p>
            <p>
              First half start:
              {' '}
              {timeFormat(first_half_start)}
            </p>
            <p>
              First half end:
              {' '}
              {timeFormat(first_half_end)}
            </p>
            <p>
              Second half start:
              {' '}
              {timeFormat(second_half_start)}
            </p>
            <p>
              Second half end:
              {' '}
              {timeFormat(second_half_end)}
            </p>

            <h4>Characters in</h4>
            <ul>
              {appearances.map((app) => {
                const levelUp = level_ups.find((el) => el.char_name === app.character.name);
                const player = attendance.find((el) => el.player.id === app.character.player);
                return (
                  <li key={app.character.name}>
                    {' '}
                    {app.character.name}
                    {' '}
                    {player ? <span>{` | ${player.player.full_name}`}</span> : <span>{' | ?'}</span>}
                    {levelUp && <span>{` | leveled up to ${levelUp.level}`}</span>}
                  </li>
                );
              })}
            </ul>

            {combat_encounters.length > 0
            && (
              <>
                <h4>Combat Encounters</h4>
                <ul>
                  {combat_encounters.map((encounter) => (
                    <li key={encounter.name}>
                      {encounter.name}
                      {' '}
                      , starts at
                      {' '}
                      {timeFormat(encounter.start)}
                      {' '}
                      , end at
                      {' '}
                      {timeFormat(encounter.end)}
                      {' '}
                      , rounds:
                      {' '}
                      {encounter.rounds}
                    </li>
                  ))}
                </ul>
              </>
            )}

          </TabPanel>
          <TabPanel>
            <h3>
              Spells Cast (
              {casts.length}
              )
            </h3>
            <SpellTable
              data={castsDisplay}
              timestampAccessor={{vodLinks: 'vod_links'}}
              title=""
              hideEpisode
            />
          </TabPanel>
          <TabPanel>
            <h3>
              Rolls (
              {rolls.length}
              )
            </h3>
            <RollTable
              data={rollsDisplay}
              timestampAccessor={{vodLinks: 'vod_links'}}
              title=""
              hideEpisode
            />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}

EpisodeDetail.propTypes = {
  episode: PropTypes.shape({
    air_date: PropTypes.string,
    attendance: PropTypes.array,
    appearances: PropTypes.array,
    campaign: PropTypes.object,
    casts: PropTypes.array,
    combat_encounters: PropTypes.array,
    description: PropTypes.string,
    first_half_end: PropTypes.number,
    first_half_start: PropTypes.number,
    length: PropTypes.length,
    level_ups: PropTypes.array,
    second_half_start: PropTypes.number,
    second_half_end: PropTypes.number,
    next_episode: PropTypes.number,
    num: PropTypes.number,
    prev_episode: PropTypes.number,
    rolls: PropTypes.array,
    title: PropTypes.string,
    vod_links: PropTypes.array,
  }).isRequired,
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/episodes/api/episode`);
  const paths = data.map((episode) => ({
    params: { id: episode.id.toString() },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const episode = (await axios.get(`${process.env.DB_HOST}/episodes/api/episode/${params.id}`)).data;
  return { props: { episode } };
}

export default EpisodeDetail;
