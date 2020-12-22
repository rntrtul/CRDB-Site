import React from "react";
import Table from "./table";
import {
  characterCol,
  damageCol,
  episodeCol,
  killsCol,
  rollTypeCol,
  timeStampEpisodeCol,
  timeStampGenericCol,
  totalCol,
  naturalCol,
  notesCol,
} from "./columnTypes";

export function RollTable({ data, isEpisode = false, showFilter=false}) {
  const columns = React.useMemo(
    () => [
      ...(isEpisode ? [] : [episodeCol]),
      ...(isEpisode ? [timeStampEpisodeCol] : [timeStampGenericCol]),
      characterCol,
      rollTypeCol,
      totalCol,
      naturalCol,
      notesCol,
      damageCol,
      killsCol,
    ],
    []
  );

  //do processing on data here

  return <Table columns={columns} data={data} showFilter={showFilter} />;
}

export default RollTable;
