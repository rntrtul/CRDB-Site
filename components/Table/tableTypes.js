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
  characterAccessor = {},
  damageAccessor = {},
  episodeAccessor = {},
  hideCharacter = false,
  hideDamage = false,
  hideEpisode = false,
  hideKills = false,
  hideNatural = false,
  hideNotes = false,
  hiudeRollType = false,
  hideTotal = false,
  hideTimestamp = false,
  killsAccessor = {},
  naturalAccessor = {},
  notesAccessor = {},
  rollTypeAccessor = {},
  totalAccessor = {},
  timestampAccessor = {},
  title = 'Rolls Count:',
}) {
  const columns = React.useMemo(
    () => [
      ...(hideEpisode ? [] : [episodeCol(episodeAccessor)]),
      ...(hideTimestamp ? [] : [timestampCol(timestampAccessor)]),
      ...(hideCharacter ? [] : [characterCol(characterAccessor)]),
      ...(hiudeRollType ? [] : [rollTypeCol(rollTypeAccessor)]),
      ...(hideNatural ? [] : [naturalCol(naturalAccessor)]),
      ...(hideTotal ? [] : [totalCol(totalAccessor)]),
      ...(hideNotes ? [] : [notesCol(notesAccessor)]),
      ...(hideDamage ? [] : [damageCol(damageAccessor)]),
      ...(hideKills ? [] : [killsCol(killsAccessor)]),
    ], [],
  );

  return (
    <Table
      columns={columns}
      data={data}
      defaultPageSize={defaultPageSize}
      showFilter={showFilter}
      title={title}
    />);
}

function SpellTable({
  data,
  defaultPageSize = publicRuntimeConfig.defaultPageSize,
  showFilter = false,
  castLevelAccessor = {},
  characterAccessor = {},
  episodeAccessor = {},
  hideCastLevel = false,
  hideCharacter = false,
  hideEpisode = false,
  hideNotes = false,
  hideSpell = false,
  hideTimestamp = false,
  notesAccessor = {},
  spellAccessor = {},
  timestampAccessor = {},
  title = 'Spell Cast Count:',
}) {
  const columns = React.useMemo(
    () => [
      ...(hideEpisode ? [] : [episodeCol(episodeAccessor)]),
      ...(hideTimestamp ? [] : [timestampCol(timestampAccessor)]),
      ...(hideSpell ? [] : [spellCol(spellAccessor)]),
      ...(hideCharacter ? [] : [characterCol(characterAccessor)]),
      ...(hideCastLevel ? [] : [castLevelCol(castLevelAccessor)]),
      ...(hideNotes ? [] : [notesCol(notesAccessor)]),
    ], [],
  );

  return (
    <Table
      columns={columns}
      data={data}
      defaultPageSize={defaultPageSize}
      showFilter={showFilter}
      title={title}
    />);
}

export {
  RollTable,
  SpellTable,
};
