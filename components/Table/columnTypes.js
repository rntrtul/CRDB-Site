import Link from "next/link";
import { getYoutubeLink, timeFormat } from "../helpers";
import { NumberRangeColumnFilter, SelectColumnFilter } from "./table";

const castLevelCol = {
  Header: "Cast Level",
  accessor: row => row.cast_level === 0 ? "Cantrip" : row.cast_level,
  Filter: NumberRangeColumnFilter,
  filter: "between",
};

const characterCol = {
  Header: "Character",
  accessor: (row) => (
    <Link href="/characters/[id]" as={`/characters/${row.character.id}`}>
      <a>{row.character.name}</a>
    </Link>
  ),
  Filter: SelectColumnFilter,
  filter: "equals",
};

const damageCol = {
  Header: "Damage",
  accessor: "damage",
  filter: "fuzzyText",
};

const episodeCol = {
  Header: "Episode",
  accessor: (row) => (
    <Link href="/episodes/[id]" as={`/episodes/${row.episode.id}`}>
      <a>
        C{row.episode.campaign_num}E{row.episode.num}
      </a>
    </Link>
  ),
  filter: "fuzzyText",
};

const killsCol = {
  Header: "Kill(s)",
  accessor: row => row.kill_count > 0 ? row.kill_count : "",
  Filter: NumberRangeColumnFilter,
  filter: "between",
};

const naturalCol = {
  Header: "Natural",
  accessor: row => row.natural_value ? row.natural_value : '',
  Filter: NumberRangeColumnFilter,
  filter: "between",
};

const notesCol = {
  Header: "Notes",
  accessor: "notes",
  filter: "fuzzyText",
};

const rollTypeCol = {
  Header: "Roll Type",
  accessor: (row) => (
    <Link href="/rolls/types/[id]" as={`/rolls/types/${row.roll_type.id}`}>
      <a>{row.roll_type.name}</a>
    </Link>
  ),
  Filter: SelectColumnFilter,
  filter: "equals",
};

const spellCol = {
  Header: "Spell",
  accessor: (row) => (
    <Link href="/spells/[id]" as={`/spells/${row.spell.id}`}>
      <a>{row.spell.name}</a>
    </Link>
  ),
  Filter: SelectColumnFilter,
  filter: "equals",
};

const timeStampEpisodeCol =  {
  Header: "Time Stamp",
  accessor: (row) => (
      <a href={getYoutubeLink(row.timestamp, row.notes , row.vod_links)}>
        {timeFormat(row.timestamp)}
      </a>
  ),
  disableSortBy: true,
};

const timeStampGenericCol = {
  Header: "Time Stamp",
  accessor: (row) => (
    <a href={getYoutubeLink(row.timestamp, row.notes, row.episode.vod_links)}>
      {timeFormat(row.timestamp)}
    </a>
  ),
  disableSortBy: true,
};

const totalCol = {
  Header: "Total",
  accessor: row => row.final_value ? row.final_value : '',
  Filter: NumberRangeColumnFilter,
  filter: "between",
};

export {
  castLevelCol,
  characterCol,
  damageCol,
  episodeCol,
  killsCol,
  naturalCol,
  notesCol,
  rollTypeCol,
  spellCol,
  timeStampEpisodeCol,
  timeStampGenericCol,
  totalCol,
};
