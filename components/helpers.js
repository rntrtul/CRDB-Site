export function getYoutubeLink(time, notes, vodLinks) {
  // for twitch links handle in here (since it could be 1 index too) or in the else for non p2
  // change to check first is actually yt
  let ytLink = `https://youtu.be/${vodLinks[0].link_key}?t=${time}`;
  if (notes.startsWith('p2')) {
    ytLink = `https://youtu.be/${vodLinks[1].link_key}?t=${time}`;
  }
  return ytLink;
}

export function timeFormat(secs) {
  return new Date(secs * 1000).toISOString().substr(12, 7);
}

const getCellById = (row, id) => row.cells.find((cell) => cell.column.id === id);

export function getKey(row) {
  const timestamp = getCellById(row, 'Time Stamp').value.key;
  const notes = getCellById(row, 'Notes').value;
  const spell = getCellById(row, 'Spell');

  if (spell) return timestamp + spell.value.key + notes; // is ep/char spell table

  const castLevel = getCellById(row, 'Cast Level');
  const episode = getCellById(row, 'Episode');
  if (castLevel) return timestamp + episode.value.key + notes; // is spell casts (no spell col)

  const by = getCellById(row, 'By');
  if (by) return timestamp + by + notes; // is potion table

  const character = getCellById(row, 'Character');
  const total = getCellById(row, 'Total').value;
  if (character) return timestamp + character.value.key + total + notes; // is char roll table (no char col)

  return timestamp + total + notes; // is normal roll table
}
