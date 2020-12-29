import React from 'react';
import ReactFrappeChart from 'react-frappe-charts';
import PropTypes from 'prop-types';
import BarChart from '../Charts/bar';

const CharacterStats = ({
  damageTotal,
  natOnes,
  natTwenty,
  hdywtCount,
  killCount,
  rollCounts,
  topRollTypes,
  epTotals,
  campaign,
  appearances,
  topSpells,

}) => {
  const normalRolls = rollCounts.total - rollCounts.advantages - rollCounts.disadvantages;
  const rollData = [rollCounts.disadvantages, rollCounts.advantages, normalRolls];
  const rollColours = ['red', 'blue', 'light-blue'];
  const rollLabels = ['Disadvantage', 'Advantage', 'Normal'];

  const insertType = (num, label, colour, colourArr, dataArr, labelArr) => {
    dataArr.splice(-1, 0, num);
    // eslint-disable-next-line no-param-reassign
    dataArr[-1] = rollData[-1] - rollData[-2];
    labelArr.splice(-1, 0, label);
    colourArr.splice(-1, 0, colour);
  };

  if (rollCounts.luck !== 0) insertType(rollCounts.luck, 'Luck', 'green', rollColours, rollData, rollLabels);
  if (rollCounts.fate !== 0) insertType(rollCounts.fate, 'Fate', 'orange', rollColours, rollData, rollLabels);
  if (rollCounts.decahedron !== 0) insertType(rollCounts.decahedron, 'Fragment of Possibility', 'purple', rollColours, rollData, rollLabels);

  return (
    <>
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          <div className="tile is-child box">
            <div className="level is-mobile">
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Damage Dealt</p>
                  <p className="title">{damageTotal}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tile is-parent">
          <div className="tile is-child box">
            <div className="level is-mobile">
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Natural 1&apos;s</p>
                  <p className="title">{natOnes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tile is-parent">
          <div className="tile is-child box">
            <div className="level is-mobile">
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Natural 20&apos;s</p>
                  <p className="title">{natTwenty}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tile is-parent">
          <div className="tile is-child box">
            <div className="level is-mobile">
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">HDYWTDT</p>
                  <p className="title">{hdywtCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tile is-parent">
          <div className="tile is-child box">
            <div className="level is-mobile">
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Kills</p>
                  <p className="title">{killCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReactFrappeChart
        type="percentage"
        title={`Rolls (${rollCounts.total} total)`}
        colors={rollColours}
        barOptions={{ depth: 0 }}
        data={{
          labels: rollLabels,
          datasets: [{ values: rollData }],
        }}
      />

      <div className="tile is-ancestor">
        <div className="tile is-parent">
          <div className="tile is-child">
            <BarChart
              title="Top Roll Types"
              colors={['blue']}
              yToolTip=" roll"
              labels={topRollTypes.map((type) => type[0])}
              datasets={[{ values: topRollTypes.map((type) => type[1]) }]}
              valuesOverPoints
            />
          </div>
        </div>
        <div className="tile is-parent">
          <div className="tile is-child no_x_axis">
            <BarChart
              title="Rolls Per Episode"
              colors={['green']}
              xToolTip="EP "
              yToolTip=" roll"
              labels={[...Array(campaign?.length).keys()].map((x) => x + 1)}
              datasets={[{ values: epTotals?.rolls }]}
              yMarkers={[{
                label: 'Avg.',
                value: epTotals?.rolls.reduce((a, b) => a + b)
                  / appearances.length,
                options: { labelPos: 'left' },
              }]}
            />
          </div>
        </div>
      </div>

      {topSpells.total_count > 0
      && (
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child">
              <BarChart
                title={`Top Spells Cast (${topSpells.total_count} total)`}
                colors={['light-blue']}
                labels={topSpells.list.map((spell) => spell[0])}
                datasets={[{ values: topSpells.list.map((spell) => spell[1]) }]}
                yToolTip=" cast"
                valuesOverPoints
              />
            </div>
          </div>
          <div className="tile is-parent">
            <div className="tile is-child no_x_axis">
              <BarChart
                title="Cast Per Epiosde"
                colors={['light-green']}
                xToolTip="EP "
                yToolTip=" cast"
                labels={[...Array(campaign?.length).keys()].map((x) => x + 1)}
                datasets={[{ values: epTotals?.casts }]}
                yMarkers={[{
                  label: 'Avg.',
                  value: epTotals?.casts.reduce((a, b) => a + b)
                    / appearances.length,
                  options: { labelPos: 'left' },
                }]}
              />
            </div>
          </div>

        </div>
      )}
      <div className="no_x_axis">
        <BarChart
          title="Damage Dealt Per Episode"
          colors={['blue']}
          xToolTip="Ep "
          yToolTip=" point"
          labels={[...Array(campaign?.length).keys()].map((x) => x + 1)}
          datasets={[{ values: epTotals?.dmg_dealt }]}
          yMarkers={[{
            label: 'Avg.',
            value: epTotals?.dmg_dealt.reduce((a, b) => a + b)
              / appearances.length,
            options: { labelPos: 'left' },
          }]}
        />
      </div>
    </>
  );
};

CharacterStats.propTypes = {
  appearances: PropTypes.arrayOf(
    PropTypes.shape({
      air_date: PropTypes.string,
      episode: PropTypes.number,
      episode_title: PropTypes.string,
      episode_num: PropTypes.number,
    }),
  ).isRequired,
  campaign: PropTypes.shape({
    name: PropTypes.string,
    length: PropTypes.number,
  }).isRequired,
  damageTotal: PropTypes.number,
  epTotals: PropTypes.shape({
    rolls: PropTypes.arrayOf(PropTypes.number),
    casts: PropTypes.arrayOf(PropTypes.number),
    dmg_dealt: PropTypes.arrayOf(PropTypes.number),
  }),
  hdywtCount: PropTypes.number,
  killCount: PropTypes.number,
  natOnes: PropTypes.number,
  natTwenty: PropTypes.number,
  rollCounts: PropTypes.shape({
    advantages: PropTypes.number,
    decahedron: PropTypes.number,
    disadvantages: PropTypes.number,
    fate: PropTypes.number,
    luck: PropTypes.number,
    total: PropTypes.number,
  }),
  topRollTypes: PropTypes.arrayOf(PropTypes.array),
  topSpells: PropTypes.shape({
    total_count: PropTypes.number,
    list: PropTypes.arrayOf(PropTypes.array),
  }),
};

export default CharacterStats;
