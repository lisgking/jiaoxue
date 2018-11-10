import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Tag } from 'antd';
import Scrollbar from 'react-smooth-scrollbar';

import Lanes from '../../components/Lanes';
import './lane.scss';

@inject('laneStore')
@observer
class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onRearrange = (dragIndex, hoverIndex) => {
    this.props.laneStore.moveLane(dragIndex, hoverIndex);
  }
  render() {
    const { allLanes,
      fetchLane,
      lanes,
      getLaneOptionsById,
      changeLaneOption,
      updateLaneSort,
      updateLane,
      deleteLane } = this.props.laneStore;
    return (
      <div className="private-container">
        <Lanes
          fetchLane={fetchLane}
          onRemoveLane={deleteLane}
          onMoveCard={this.onRearrange}
          onDrop={updateLaneSort}
          changeLaneOption={changeLaneOption}
          getLaneOptions={id => getLaneOptionsById(id)}
          data={lanes}
          updateLane={updateLane}
        />
      </div>
    );
  }
}


export default Container;
