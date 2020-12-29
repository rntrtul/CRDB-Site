import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { RollTable } from '../../../components/Table/tableTypes';

function WeaponDetail({
  weapon: {
    damages,
    dmg_total,
    name,
    uses,
  },
}) {
  return (
    <div className="content">
      <h1>{name}</h1>
      <p className="subtitle">
        { damages.map((dt, i) => (
          <span>
            {dt.die_num}
            d
            {dt.die.sides}
            {' '}
            {dt.modifier > 0 && (
            <>
              {' '}
              +
              {dt.modifier}
            </>
            )}
            {' '}
            {dt.damage_type > 0 && dt.damage_type.name}
            {i < damages.length - 1 && <b> + </b>}
          </span>
        ))}
      </p>
      <p>This is not damage but to attack (next roll should be damage)</p>
      <p>
        Total Damage Done With:
        {dmg_total.final_total}
      </p>
      <p>
        Total Damage Contributated:
        {dmg_total.nat_total}
      </p>
      <p>
        Total uses:
        {uses.length}
      </p>

      <RollTable
        data={uses}
        characterAccessor={{
          id: 'roll.character.id',
          name: 'roll.character.name',
        }}
        episodeAccessor={{
          id: 'roll.episode.id',
          campNum: 'roll.episode.campaign_num',
          num: 'roll.episode.num',
        }}
        timestampAccessor={{
          timestamp: 'roll.timestamp',
          notes: 'roll.notes',
          vodLinks: 'roll.episode.vod_links',
        }}
        rollTypeAccessor={{
          id: 'roll.roll_type.id',
          name: 'roll.roll_type.name',
        }}
        naturalAccessor={{ natVal: 'roll.natural_value' }}
        totalAccessor={{ finalVal: 'roll.final_value' }}
        notesAccessor={{ notes: 'roll.notes' }}
        damageAccessor={{ damage: 'roll.damage' }}
        showFilter
      />
    </div>
  );
}

WeaponDetail.propTypes = {
  weapon: PropTypes.shape({
    damages: PropTypes.arrayOf(PropTypes.shape({
      die_num: PropTypes.number,
      modifier: PropTypes.number,
    })),
    dmg_total: PropTypes.shape({
      final_total: PropTypes.number,
      nat_total: PropTypes.number,
    }),
    name: PropTypes.string,
    uses: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
    })),
  }).isRequired,
};

export async function getStaticPaths() {
  const { data } = await axios.get(`${process.env.DB_HOST}/items/api/weapon`);
  const paths = data.map((weapon) => ({
    params: { id: weapon.id.toString() },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const weapon = (await axios.get(`${process.env.DB_HOST}/items/api/weapon/${params.id}`)).data;
  return { props: { weapon } };
}

export default WeaponDetail;
