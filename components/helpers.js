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
