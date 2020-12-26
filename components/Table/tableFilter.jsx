import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';

const TableFilter = ({
  headerGroups,
  isVisible = false,
}) => {
  const [visible, setVisible] = useState(isVisible);

  return (
    <>
      <button className="button" onClick={() => setVisible(!visible)} type="button">
        {visible ? <GrClose /> : <FaFilter />}
      </button>
      <div className="box" style={{ display: visible ? 'inherit' : 'none' }}>
        {headerGroups.map((headerGroup) => (
          <form {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <div className="field" {...column.getHeaderProps} key={column.id}>
                <label className="label">{column.render('Header')}</label>
                {column.canFilter && (
                  <div className="control">
                    {column.render('Filter')}
                  </div>
                )}
              </div>
            ))}
          </form>
        ))}
      </div>

    </>
  );
};

export default TableFilter;
