import React from "react";
import Table, {SelectColumnFilter, NumberRangeColumnFilter} from './table';
import {get_yt_link, timeFormat} from "../helpers";
import Link from "next/link";

export function RollTable({data}){

  const columns = React.useMemo(() => [
    {
      Header: 'Episode',
      accessor: row =>
        <Link href="/episodes/[id]" as={`/episodes/${row.ep.id}`}>
          <a>C{row.ep.campaign_num}E{row.ep.num}</a>
        </Link>,
      filter: 'fuzzyText',
    },
    {
      Header: 'Time Stamp',
      accessor: row => <a
          href={get_yt_link(row.time_stamp, row.notes, row.ep.vod_links)}>{timeFormat(row.time_stamp)}</a>,
      disableSortBy: true,
    },
    {
      Header: 'Character',
      accessor: row =>
          <Link href="/characters/[id]" as={`/characters/${row.character.id}`}>
            <a>{row.character.name}</a>
          </Link>,
      Filter: SelectColumnFilter,
      filter: 'equals',
    },
    {
      Header: 'Roll Type',
      accessor: row =>
          <Link href="/rolls/types/[id]" as={`/rolls/types/${row.roll_type.id}`}>
            <a>{row.roll_type.name}</a>
          </Link>,
      Filter: SelectColumnFilter,
      filter: 'equals',
    },
    {
      Header: 'Total',
      accessor: 'final_value',
      Filter: NumberRangeColumnFilter,
      filter: 'between',
    },
    {
      Header: 'Natural',
      accessor: 'natural_value',
      Filter: NumberRangeColumnFilter,
      filter: 'between',
    },
    {
      Header: 'Notes',
      accessor: 'notes',
      filter: 'fuzzyText',
    },
    {
      Header: 'damage',
      accessor: 'damage',
      filter: 'fuzzyText',
    },
    {
      Header: 'kills',
      accessor: 'kill_count',
      Filter: NumberRangeColumnFilter,
      filter: 'between',
    },
  ], [])

  //do processing on data here

  return (
    <Table columns={columns} data={data} />
  )
}

export default RollTable
