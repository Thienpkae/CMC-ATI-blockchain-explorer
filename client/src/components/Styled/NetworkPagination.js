/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const NetworkPagination = ({
  className,
  style,
  page,
  pages,
  pageSize,
  sortedData,
  data,
  onPageChange,
  canPrevious,
  canNext,
}) => {
  const totalRecords = useMemo(() => {
    if (Array.isArray(sortedData)) {
      return sortedData.length;
    }
    if (Array.isArray(data)) {
      return data.length;
    }
    return 0;
  }, [sortedData, data]);

  const totalPages = Math.max(pages || Math.ceil(totalRecords / (pageSize || 1)) || 1, 1);
  const safePage = Math.min(page || 0, totalPages - 1);
  const hasResults = totalRecords > 0;
  const startResult = hasResults ? safePage * pageSize + 1 : 0;
  const endResult = hasResults ? Math.min((safePage + 1) * pageSize, totalRecords) : 0;

  const handlePageChange = target => {
    if (target === safePage || target < 0 || target > totalPages - 1) return;
    onPageChange(target);
  };

  return (
    <div className={classNames('network-pagination', className)} style={style}>
      <div className="network-pagination__summary">
        {hasResults
          ? `Showing ${startResult} to ${endResult} of ${totalRecords} results`
          : 'Showing 0 results'}
      </div>

      <div className="network-pagination__actions">
        <button
          type="button"
          className="network-pagination__btn"
          onClick={() => handlePageChange(0)}
          disabled={safePage === 0}
        >
          <span className="network-pagination__icon">{'«'}</span>
          <span>First</span>
        </button>
        <button
          type="button"
          className="network-pagination__btn"
          onClick={() => handlePageChange(safePage - 1)}
          disabled={!canPrevious}
        >
          <span className="network-pagination__icon">{'‹'}</span>
          <span>Previous</span>
        </button>

        <div className="network-pagination__status">
          {`${safePage + 1} of ${totalPages}`}
        </div>

        <button
          type="button"
          className="network-pagination__btn"
          onClick={() => handlePageChange(safePage + 1)}
          disabled={!canNext}
        >
          <span>Next</span>
          <span className="network-pagination__icon">{'›'}</span>
        </button>
        <button
          type="button"
          className="network-pagination__btn"
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={safePage === totalPages - 1}
        >
          <span>Last</span>
          <span className="network-pagination__icon">{'»'}</span>
        </button>
      </div>
    </div>
  );
};

NetworkPagination.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  page: PropTypes.number,
  pages: PropTypes.number,
  pageSize: PropTypes.number,
  sortedData: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  data: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  onPageChange: PropTypes.func,
  canPrevious: PropTypes.bool,
  canNext: PropTypes.bool,
};

NetworkPagination.defaultProps = {
  className: '',
  style: undefined,
  page: 0,
  pages: 1,
  pageSize: 5,
  sortedData: undefined,
  data: [],
  onPageChange: () => {},
  canPrevious: false,
  canNext: false,
};

export default NetworkPagination;

