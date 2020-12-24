import React from 'react';
import Table from './table';
import {
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
} from './columnTypes';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

function RollTable({
  data,
  defaultPageSize = publicRuntimeConfig.defaultPageSize,
  showFilter = false,
  isEpisode = false,
  characterAccessor = {},
  damageAccessor = {},
  episodeAccessor = {},
  killsAccessor = {},
  naturalAccessor = {},
  notesAccessor = {},
  rollTypeAccessor = {},
  totalAccessor = {},
  timestampAccessor = {},
}) {
  const columns = React.useMemo(
    () => [
      ...(isEpisode ? [] : [episodeCol(episodeAccessor)]),
      timestampCol(timestampAccessor),
      characterCol(characterAccessor),
      rollTypeCol(rollTypeAccessor),
      naturalCol(naturalAccessor),
      totalCol(totalAccessor),
      notesCol(notesAccessor),
      damageCol(damageAccessor),
      killsCol(killsAccessor),
    ], [],
  );

  return (
    <Table
      columns={columns}
      data={data}
      showFilter={showFilter}
      defaultPageSize={defaultPageSize}
    />);
}

function SpellTable({
  data,
  defaultPageSize = publicRuntimeConfig.defaultPageSize,
  showFilter = false,
  isEpisode = false,
  castLevelAccessor = {},
  characterAccessor = {},
  episodeAccessor = {},
  notesAccessor = {},
  spellAccessor = {},
  timestampAccessor = {},
}) {
  const columns = React.useMemo(
    () => [
      ...(isEpisode ? [] : [episodeCol(episodeAccessor)]),
      timestampCol(timestampAccessor),
      ...(isEpisode ? [spellCol(spellAccessor)] : []),
      characterCol(characterAccessor),
      castLevelCol(castLevelAccessor),
      notesCol(notesAccessor),
    ], [],
  );

  return (
    <Table
      columns={columns}
      data={data}
      showFilter={showFilter}
      defaultPageSize={defaultPageSize}
    />);
}

export {
  RollTable,
  SpellTable,
};
