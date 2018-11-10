import DataChartCard from 'abc-data-chart-card';

import React, { PureComponent } from 'react';

import './index.scss';

class DataChartCardShiMu extends PureComponent {
  static cardType = 'C_012';

  render() {
    return (
      <div className="data-chart-card">
        <DataChartCard
          {...this.props}
        />
      </div>
    );
  }
}

export default DataChartCardShiMu;