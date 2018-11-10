import React from 'react';
import PropsTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {
  DragSource,
  DropTarget,
} from 'react-dnd';

const { Children } = React;

const laneSource = {
  beginDrag(props) {
    return {
      id: props.id,
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

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleX = hoverBoundingRect.width;
    const clientOffset = monitor.getClientOffset();
    const hoverClientX = (clientOffset.x - hoverBoundingRect.x) + (hoverBoundingRect.width / 2);
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }
    if (props.moveCard) {
      props.moveCard(dragIndex, hoverIndex);
    }
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

@DropTarget('lane', laneTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource('lane', laneSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
export default class DragDropLane extends React.Component {
  static PropsTypes = {
    option: PropsTypes.object.isRequired,
    data: PropsTypes.object.isRequired,
    id: PropsTypes.string,
  }
  static defaultProps = {
    onDrop: () => null,
    moveCard: () => null,
  }
  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    const child = React.cloneElement(Children.only(this.props.children), { connectDragSource });
    return (
      connectDragPreview && connectDragSource &&
        connectDropTarget(<div
          className="lane-dragDropBox"
          style={{ ...style, opacity }}
        >
          {child}
        </div>
        )
    );
  }
}
