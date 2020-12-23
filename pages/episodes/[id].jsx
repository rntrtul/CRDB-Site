import React from 'react';
import axios from 'axios';
import Head from 'next/head';
import ReactFrappeChart from 'react-frappe-charts';
import PropTypes from 'prop-types';
import { timeFormat } from '../../components/helpers';
import { RollTable, SpellTable } from '../../components/Table/tableTypes';

function EpisodeDetail({ episode }) {
  const rollsDisplay = episode.rolls.map((roll) => ({
    timestamp: roll.timestamp,
    character: roll.character,
    roll_type: roll.roll_type,
    natural_value: roll.natural_value,
    final_value: roll.final_value,
    notes: roll.notes,
    damage: roll.damage,
    kill_count: roll.kill_count,
    vod_links: episode.vod_links,
  }));

  const castsDisplay = episode.casts.map((cast) => ({
    timestamp: cast.timestamp,
    spell: cast.spell,
    character: cast.character,
    cast_level: cast.cast_level,
    notes: cast.notes,
    vod_links: episode.vod_links,
  }));

  return (
    <>
      <Head><title>{episode.title}</title></Head>
      <div className="content is-medium">
        <h1>
          {episode.title}
          {' '}
          (C
          {episode.campaign.num}
          E
          {episode.num}
          )
        </h1>
        <h4>{episode.air_date}</h4>
        <p className="is-medium">{episode.description}</p>
        <p>
          Length:
          {' '}
          {timeFormat(episode.length)}
        </p>
      </div>

      <div className="content">

        <h5>Times:</h5>
        <ReactFrappeChart
          type="percentage"
          title="Time Breakdown"
          colors={['dark-grey', 'blue', 'dark-grey', 'blue', 'dark-grey']}
          barOptions={{ depth: 0 }}
          tooltipOptions={{
            formatTooltipX: (d) => d,
            formatTooltipY: (d) => d,
          }}
          data={{
            labels: ['Announcements', 'First Half', 'Break', 'Second Half', 'End'],
            datasets: [{
              values:
              [episode.first_half_start,
                episode.first_half_end - episode.first_half_start,
                episode.second_half_start - episode.first_half_end,
                episode.second_half_end - episode.second_half_start,
                episode.length - episode.second_half_end],
            }],
          }}
        />

        <p>
          Break length:
          {' '}
          {timeFormat(episode.second_half_start - episode.first_half_end)}
        </p>
        <p>
          First half start:
          {' '}
          {timeFormat(episode.first_half_start)}
        </p>
        <p>
          First half end:
          {' '}
          {timeFormat(episode.first_half_end)}
        </p>
        <p>
          Second half start:
          {' '}
          {timeFormat(episode.second_half_start)}
        </p>
        <p>
          Second half end:
          {' '}
          {timeFormat(episode.second_half_end)}
        </p>

        <h4>Characters in</h4>
        <ul>
          {episode.appearances.map((app) => {
            const levelUp = episode.level_ups.find((el) => el.char_name === app.character.name);
            const player = episode.attendance.find((el) => el.player.id === app.character.player);
            return (
              <li key={app.character.name}>
                {' '}
                {app.character.name}
                {' '}
                {player ? <span>{` | ${player.player.full_name}`}</span> : <span>{' | ?'}</span>}
                { levelUp && <span>{` | leveled up to ${levelUp.level}`}</span> }
              </li>
            );
          })}
        </ul>

        {episode.combat_encounters.length > 0
          && (
          <>
            <h4>Combat Encounters</h4>
            <ul>
              {episode.combat_encounters.map((encounter) => (
                <li>
                  {encounter.name}
                  , starts at
                  {timeFormat(encounter.start)}
                  , end at
                  {timeFormat(encounter.end)}
                  , rounds:
                  {encounter.rounds}
                </li>
              ))}
            </ul>
          </>
          )}

        <h3>
          Spells Cast (
          {episode.casts.length}
          )
        </h3>
        <SpellTable data={castsDisplay} isEpisode timestampAccessor={{ vodLinks: 'vod_links' }} />

        <h3>
          Rolls (
          {episode.rolls.length}
          )
        </h3>

        <RollTable data={rollsDisplay} isEpisode timestampAccessor={{ vodLinks: 'vod_links' }} />

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
    num: PropTypes.number,
    title: PropTypes.string,
    rolls: PropTypes.array,
    vod_links: PropTypes.array,
  }).isRequired,
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/episodes/api/episode`);
  const paths = data.results.map((episode) => ({
    params: { id: episode.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const episode = (await axios.get(`${process.env.DB_HOST}/episodes/api/episode/${params.id}`)).data;
  return { props: { episode } };
}

export default EpisodeDetail;
