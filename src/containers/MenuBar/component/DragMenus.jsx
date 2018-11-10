import React from 'react';

import { inject, observer } from 'mobx-react';
import MenuItem from './MenuItem';
import DragDropLane from '../../../components/Lanes/DragDropLane';
import withDragDropContext from '../../../components/withDragDropContext';
// @DragDropContext(HTML5Backend)
@withDragDropContext
@inject('laneStore')
@observer
class DragMenus extends React.Component {
  moveCard = (dragIndex, hoverIndex) => {
    this.props.laneStore.moveLane(dragIndex, hoverIndex);
  }
  render() {
    const { lanes, getLaneOptionsById, onDrop, isExpand } = this.props;
    return (
      <span>
        {[...lanes].map((lane, i) => {
          const item = getLaneOptionsById(lane.subscribeId);
          const { name, iconSvg } = item;
          const key = `${lane.id}-${name}-${lane.name}`;
          return (<DragDropLane
            id={name}
            index={i}
            key={key}
          >
            <MenuItem
              key={key}
              isExpand={isExpand}
              index={i}
              icon={iconSvg}
              moveCard={this.moveCard}
              subscribeId={lane.subscribeId}
              text={lane.name}
              goToLane={() => lane.goToLane()}
              onDrop={onDrop}
            />
          </DragDropLane>);
        })}
      </span>
    );
  }
}

DragMenus.propTypes = {};

export default DragMenus;
