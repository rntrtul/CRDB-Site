import Link from "next/link";
import { getYoutubeLink, timeFormat } from "../helpers";
import { NumberRangeColumnFilter, SelectColumnFilter } from "./table";

const downObj = (path, obj) => {
  const stepPath = path.split('.');
  let curr = obj;
  for (const index in stepPath){
    curr = curr[stepPath[index]];
  }
  return curr;
}

const castLevelCol = ({ castLevel = "cast_level" }) => ({
  Header: "Cast Level",
  accessor: row => downObj(castLevel, row) === 0 ? "Cantrip" : downObj(castLevel, row),
  Filter: NumberRangeColumnFilter,
  filter: "between",
});

const characterCol = ({ id = "character.id", name = "character.name" }) => ({
  Header: "Character",
  accessor: (row) => (
    <Link href="/characters/[id]" as={`/characters/${downObj(id, row)}`}>
      <a>{downObj(name, row)}</a>
    </Link>
  ),
  Filter: SelectColumnFilter,
  filter: "equals",
});

const damageCol = ({ damage = "damage" }) => ({
  Header: "Damage",
  accessor: row => downObj(damage, row),
  filter: "fuzzyText",
});

const episodeCol = ({
  id = "episode.id",
  campNum = "episode.campaign_num",
  num = "episode.num"
}) => ({
  Header: "Episode",
  accessor: (row) => (
    <Link href="/episodes/[id]" as={`/episodes/${downObj(id, row)}`}>
      <a>
        C{downObj(campNum, row)}E{downObj(num, row)}
      </a>
    </Link>
  ),
  filter: "fuzzyText",
});

const killsCol = ({ killCount = "kill_count" }) => ({
  Header: "Kill(s)",
  accessor: row => downObj(killCount, row) > 0 ? downObj(killCount, row) : "",
  Filter: NumberRangeColumnFilter,
  filter: "between",
});

const naturalCol = ({ natVal = "natural_value" }) => ({
  Header: "Natural",
  accessor: row => downObj(natVal, row) ? downObj(natVal, row) : '',
  Filter: NumberRangeColumnFilter,
  filter: "between",
});

const notesCol = ({ notes = "notes" }) => ({
  Header: "Notes",
  accessor: row => downObj(notes, row),
  filter: "fuzzyText",
});

const rollTypeCol = ({id = "roll_type.id", name = "roll_type.name"}) => ({
  Header: "Roll Type",
  accessor: (row) => (
    <Link href="/rolls/types/[id]" as={`/rolls/types/${downObj(id, row)}`} id={downObj(name, row)}>
      <a>{downObj(name, row)}</a>
    </Link>
  ),
  Filter: SelectColumnFilter,
  filter: "equals",
});

const spellCol = ({ id = "spell.id", name = "spell.name" }) => ({
  Header: "Spell",
  accessor: (row) => (
    <Link href="/spells/[id]" as={`/spells/${downObj(id, row)}`}>
      <a>{downObj(name, row)}</a>
    </Link>
  ),
  Filter: SelectColumnFilter,
  filter: "equals",
});

const timestampCol = ({
  timestamp = "timestamp",
  notes = "notes",
  vodLinks = "episode.vod_links"}
) => ({
  Header: "Time Stamp",
  accessor: (row) => (
      <a href={getYoutubeLink(downObj(timestamp, row), downObj(notes, row), downObj(vodLinks, row))}>
        {timeFormat(downObj(timestamp, row))}
      </a>
  ),
  disableSortBy: true,
});

const totalCol = ({ finalVal = "final_value" }) => ({
  Header: "Total",
  accessor: row => downObj(finalVal, row) ? downObj(finalVal, row) : '',
  Filter: NumberRangeColumnFilter,
  filter: "between",
});

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
  timestampCol,
  totalCol,
};
