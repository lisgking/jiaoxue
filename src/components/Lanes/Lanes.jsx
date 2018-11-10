/**
|--------------------------------------------------
| @author hawk
| @day 2018/10/10
|--------------------------------------------------
*/
import React from 'react';
import PropTypes from 'prop-types';
import Scrollbar from 'react-smooth-scrollbar';

import DragDropLane from './DragDropLane';
import Lane from './Lane';
import FilterTags from '../FilterTags';
import withDragDropContext from '../withDragDropContext';

@withDragDropContext
export default class Lanes extends React.Component {
  state = {
    lanes: [],
  }
  static defaultProps = {
    onMoveCard: () => null,
  }
  static propTypes = {
    onMoveCard: PropTypes.func,
    getLaneOptions: PropTypes.func.isRequired,
  }
  static getDerivedStateFromProps(props) {
    return {
      lanes: [...props.data],
    };
  }
  moveCard = (dragIndex, hoverIndex) => {
    if (this.props.onMoveCard) {
      this.props.onMoveCard(dragIndex, hoverIndex);
    }
  }
  handleDrop = () => {
    const { onDrop } = this.props;
    console.log('drop');
    if (onDrop) {
      onDrop();
    }
  }
  render() {
    const { changeLaneOption,
      onRemoveLane, fetchLane, updateLane } = this.props;
    const { lanes } = this.state;
    return (<div
      style={{
        width: `${lanes.length * 280}px`,
      }}
      className="lanes-wrap"
    >
      {lanes.map((v, i) => {
        const { subscribeId, id: laneId } = v;
        const defaultOptions = this.props.getLaneOptions(subscribeId);
        let key = subscribeId + laneId;
        if (subscribeId === 'Y_1000') {
          key = `${subscribeId}${v.name}${laneId}`;
        }
        if (v.id === null) {
          debugger;
        }
        return (<DragDropLane
          id={key}
          index={i}
          key={key}
          onDrop={this.handleDrop}
          moveCard={this.moveCard}
        >
          <Lane
            key={key}
            index={i}
            fetchData={fetchLane}
            onRemove={() => onRemoveLane({ index: i })}
            defaultOptions={defaultOptions}
            changeOptions={(...arg) => changeLaneOption(i, ...arg)}
            option={v}
            updateLane={updateLane}
          />
        </DragDropLane>);
      })
      }
    </div>
    );
  }
}
