import React, { Component, Fragment } from 'react';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import { Tooltip } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactTooltip from 'react-tooltip';

import { findDOMNode } from 'react-dom';
import Ellipsis from '../../../components/Ellipsis';
const { Children } = React;

const laneSource = {
  beginDrag(props) {
    return {
      id: props.text,
      index: props.index,
    };
  },
};

const laneTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = (findDOMNode(
      component
    )).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = (clientOffset).y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    props.moveCard(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
  drop(props, monitor, component) {
    if (props.onDrop) {
      props.onDrop();
    }
  },
};

const style = {
};

@DropTarget('panel', laneTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource('panel', laneSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
export default class MenuItem extends Component {
  static defaultProps = {
    subscribeId: '',
    name: '',
    goToLane: () => {
      console.log('goToLane');
    },
    onDrop: () => null,
    moveCard: () => null,
    isExpand: true,
  }
  render() {
    const { text, subscribeId, goToLane, icon, isExpand, id } = this.props;
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    return (connectDragPreview && connectDragSource && connectDragPreview(
      connectDropTarget(connectDragSource(
        <div
          key={subscribeId}
          onClick={() => goToLane()}
          className="item"
          style={{ ...opacity }}
        >
          {isExpand
            ? <Fragment>
              <span className="menuIcon">
                <svg style={{ width: '16px', height: '16px' }} className="icon" aria-hidden="true">
                  <use xlinkHref={`#${icon}`} />
                </svg>
              </span>
              <div className="menuName" title={text}>
                <Ellipsis lines={1}>
                  {text}
                </Ellipsis>
              </div>
            </Fragment>
            :
            <Fragment>
              <span
                className="menuIcon"
                data-for="menuTooltip"
                data-tip={text}
              >
                <svg style={{ width: '16px', height: '16px' }} className="icon" aria-hidden="true">
                  <use xlinkHref={`#${icon}`} />
                </svg>
              </span>
            </Fragment>
          }
        </div >
      ))));
  }
}
