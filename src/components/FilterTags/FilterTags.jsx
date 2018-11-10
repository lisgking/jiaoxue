import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from 'antd';
import Ellipsis from '../Ellipsis';

export default class FilterTags extends React.Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onRemoveTag: PropTypes.func,
  }
  static defaultProps = {
    onChange: () => null,
    values: {},
    onRemoveTag: () => null,
  }
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handleMove = (key, value, e) => {
    e.preventDefault();
    this.props.onRemoveTag(key, value);
    this.props.onChange(this.props.tags.filter(v => v.key !== key && v.value !== value));
  }
  getText = (str) => {
    if (str.length > 10) {
      return (<Tooltip title={str}>
        {str.slice(0, 10)}...
      </Tooltip>);
    }
    return str;
  }
  render() {
    const { showMoreFilter } = this.props;
    let { tags } = this.props;
    const isMore = tags.length > 4;
    if (isMore) {
      tags = tags.slice(0, 4);
    }
    return (
      <div className="lane-search-tags">
        {tags.map((v) => {
          return (
            <Tag
              closable
              color="#fff"
              onClose={e => this.handleMove(v.key, v.value, e)}
              key={`${v.key}-${v.value}`}
            >
              <div className="tag">
                <Ellipsis tooltip lines={1}>
                  {/* {this.getText(v.tag)} */}
                  {v.tag}
                </Ellipsis>
              </div>
            </Tag>
          );
        })}
        {
          isMore
            ? <Tag
              closable={false}
              color="#fff"
              onClick={(e) => {
                if (showMoreFilter) {
                  showMoreFilter();
                }
              }}
              key="showMore"
            >
              <Tooltip title="展开" placement="right">
                <div style={{ position: 'relative', top: '-4px' }}>...</div>
              </Tooltip>
            </Tag>
            : null
        }
      </div>
    );
  }
}
