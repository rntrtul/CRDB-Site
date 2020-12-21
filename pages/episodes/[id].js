import axios from 'axios'
import Head from 'next/head'
import { timeFormat} from '../../components/helpers'
import ReactFrappeChart from "react-frappe-charts"
import RollTable from "../../components/Table/rolltable";
import SpellTable from "../../components/Table/spellTable";

function EpisodeDetail({episode}) {
  const rolls_display = episode.rolls.map((roll) => {
    return {
      "timestamp": roll.timestamp,
      "character": roll.character,
      "roll_type": roll.roll_type,
      "natural_value": roll.natural_value,
      "final_value": roll.final_value,
      "notes": roll.notes,
      "damage": roll.damage,
      "kill_count": roll.kill_count,
      "vod_links": episode.vod_links,
    }
  })

  const casts_display = episode.casts.map((cast) => {
    return {
      "timestamp": cast.timestamp,
      "spell": cast.spell,
      "character": cast.character,
      'cast_level': cast.cast_level, 
      "notes": cast.notes,
      "vod_links": episode.vod_links,
    }
  })

  return (
    <>
      <Head><title>{episode.title}</title></Head>
      <div class = "content is-medium">
        <h1>{episode.title} (C{episode.campaign.num}E{episode.num}) </h1>
        <h4>{episode.air_date}</h4>
        <p class = "is-medium">{episode.description}</p>
        <p>Length: {timeFormat(episode.length)}</p>
      </div>

      <div class = "content">

        <h5>Times:</h5>
        <ReactFrappeChart
          type="percentage"
          title="Time Breakdown"
          colors={['dark-grey', 'blue', 'dark-grey', 'blue', 'dark-grey']}
          barOptions={{depth:0}}
            tooltipOptions={{
              formatTooltipX: d => "et",
              formatTooltipY: d => " ads"
          }}
          data={{
            labels: ["Anouncments", "First Half", "Break", "Second Half", "End"],
            datasets: [{ values:
              [episode.first_half_start,
               episode.first_half_end - episode.first_half_start,
               episode.second_half_start - episode.first_half_end,
               episode.second_half_end - episode.second_half_start,
               episode.length - episode.second_half_end]
            }], 
          }}          
        />
        
        <p>Break length: {timeFormat(episode.second_half_start - episode.first_half_end)}</p>
        <p>First half start: {timeFormat(episode.first_half_start)}</p>
        <p>First half end: {timeFormat(episode.first_half_end)}</p>
        <p>Second half start: {timeFormat(episode.second_half_start)}</p>
        <p>Second half end: {timeFormat(episode.second_half_end)}</p>

        <h4>Players in</h4>
        <ul>
          {episode.attendance.map(player => <li key = {player.player.full_name}> {player.player.full_name} </li> )}
        </ul>
        
        <h4>Characters in</h4>
        <ul>
          {episode.apperances.map(app =>
              <li key={app.character.name}> {app.character.name} </li>
          )}
        </ul>

        {episode.level_ups.length > 0 &&
          <>
            <h4>Level ups this episode:</h4>
            <ul>
              {episode.level_ups.map(level_up =>
                <li key={level_up.char_id}> {level_up.char_name} leveled up to {level_up.level} </li> )}
            </ul>
          </>
        }

        {episode.combat_encounters.length > 0 &&
          <>
            <h4>Combat Encounters</h4>
            <ul>
              {episode.combat_encounters.map(encounter =>
              <li>
                {encounter.name}, starts at {timeFormat(encounter.start)}, end at {timeFormat(encounter.end)}, rounds: {encounter.rounds}
              </li> )}
            </ul>
          </>
        }

        <h3>Spells Cast ({episode.casts.length})</h3>
        <SpellTable data={casts_display} isEpisode />

        <h3>Rolls ({episode.rolls.length})</h3>

        <RollTable data={rolls_display} isEpisode />

      </div>
    </>
  )
}

export async function getStaticPaths() {
  const data = (await axios.get(`${process.env.DB_HOST}/episodes/api/episode`)).data
  const paths = data.results.map((episode) => ({
    params: {id: episode.id.toString()},
  }))

  return {paths, fallback: false}
}

export async function getStaticProps({params}){
  const episode = (await axios.get(`${process.env.DB_HOST}/episodes/api/episode/${params.id}`)).data
  return { props: { episode } }
} 

export default EpisodeDetail