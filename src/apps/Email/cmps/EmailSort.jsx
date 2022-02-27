import React, {useState} from 'react';
import './EmailSort.css'

export const EmailSort = ({sortBy}) => {
  const [sortOp, setSortOp] = useState('from-asc');
  const options = ['from-asc', 'from-des', 'date-asc', 'date-des'];

  const handleChange = async (e) => {
    e.preventDefault();
    setSortOp(e.target.value);
    await sortBy(sortOp);
  };

  return (
    <section className="sort-by">
      <label htmlFor="sort">
        <span>Sort By:</span>
        <select name="sort" id="sort" value={sortOp} onChange={handleChange}>
          {options.map((op, key) => {
            return (
              <option key={key} value={op}>{op}</option>
            );
          })}
        </select>
      </label>
    </section>
  );
};
