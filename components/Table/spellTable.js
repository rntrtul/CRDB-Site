import React from "react";
import Table from "./table";
import {
  castLevelCol,
  characterCol,
  episodeCol,
  timeStampEpisodeCol,
  timeStampGenericCol,
  spellCol,
  notesCol,
} from "./columnTypes";

export function SpellTable({ data, isEpisode = false, showFilter = false }) {
  const columns = React.useMemo(
    () => [
      ...(isEpisode ? [] : [episodeCol]),
      ...(isEpisode ? [timeStampEpisodeCol] : [timeStampGenericCol]),
      characterCol,
      spellCol,
      castLevelCol,
      notesCol,
    ],
    []
  );

  //do processing on data here

  return <Table columns={columns} data={data} showFilter={showFilter} />;
}

export default SpellTable;
