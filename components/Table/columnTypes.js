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
  filter: (rows, columnIds, filterValue) => rows.filter((row) => {
    const val = row.values['Cast Level'] !== "Cantrip" ? row.values['Cast Level'] : 0;
    return val >= filterValue[0] && val <= filterValue[1];
  }),
});

const characterCol = ({ id = "character.id", name = "character.name" }) => ({
  Header: "Character",
  accessor: (row) => (
    <Link
      key={downObj(name, row)}
      href="/characters/[id]"
      as={`/characters/${downObj(id, row)}`}
    >
      <a>{downObj(name, row)}</a>
    </Link>
  ),
  Filter: SelectColumnFilter,
  filter: (rows, columnIds, filterValue) => rows.filter((row) => row.values['Character'].key === filterValue),
  disableSortBy: true,
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
    <Link
      key={`C${downObj(campNum, row)}E${downObj(num, row)}`}
      href="/episodes/[id]"
      as={`/episodes/${downObj(id, row)}`}
    >
      <a>
        C{downObj(campNum, row)}E{downObj(num, row)}
      </a>
    </Link>
  ),
  filter: (rows, columnIds, filterValue) => rows.filter((row) => row.values['Episode'].key.includes(filterValue)),
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
    <Link
      key={downObj(name, row)}
      href="/rolls/types/[id]"
      as={`/rolls/types/${downObj(id, row)}`}
    >
      <a>{downObj(name, row)}</a>
    </Link>
  ),
  Filter: SelectColumnFilter,
  filter: (rows, columnIds, filterValue) => rows.filter((row) => row.values['Roll Type'].key === filterValue),
});

const spellCol = ({ id = "spell.id", name = "spell.name" }) => ({
  Header: "Spell",
  accessor: (row) => (
    <Link
      key={downObj(name, row)}
      href="/spells/[id]"
      as={`/spells/${downObj(id, row)}`}
    >
      <a>{downObj(name, row)}</a>
    </Link>
  ),
  Filter: SelectColumnFilter,
  filter: (rows, columnIds, filterValue) => rows.filter((row) => row.values['Spell'].key === filterValue),
});

const timestampCol = ({
  timestamp = "timestamp",
  notes = "notes",
  vodLinks = "episode.vod_links"}
) => ({
  Header: "Time Stamp",
  accessor: (row) => (
      <a
        key={timeFormat(downObj(timestamp, row))}
        href={getYoutubeLink(downObj(timestamp, row), downObj(notes, row), downObj(vodLinks, row))}
      >
        {timeFormat(downObj(timestamp, row))}
      </a>
  ),
  disableSortBy: true,
  filter: (rows, columnIds, filterValue) => rows.filter((row) => row.values['Time Stamp'].key.includes(filterValue)),
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
