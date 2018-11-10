import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import './RecommendButton.scss';

export default class RecommendButton extends Component {
  static defaultProps = {
    id: '', // 泳道Id
    name: '',
    loading: false,
    lanes: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  onClick = (id, checked) => {
    if (this.props.onChange) {
      this.props.onChange(id, checked);
    }
    this.setState({
      checked: !checked,
    });
  }

  /**
   * 判断当前泳道是否被选中
   */
  isChecked = () => {
    const { lanes, id } = this.props;
    console.log(this.props.id);
    const flag = lanes.filter((lane) => {
      return lane.subscribeId === id;
    });
    return flag.length > 0;
  }

  render() {
    const { id, name, loading } = this.props;
    const checked = this.isChecked();
    const icon = checked ? 'icon-dui' : 'icon-plus';
    return (
      <div className="recommendButton">
        <Button
          className={`middle ${checked ? 'checked' : ''}`}
          type="dashed"
          loading={loading}
          onClick={() => { this.onClick(id, checked); }}
        >
          <span className="name">
            {name}
          </span>
          {
            checked
              ? <svg className="icon" aria-hidden="true">
                <use style={{ color: '#55A956' }} xlinkHref={`#${icon}`} />
              </svg>
              : <svg className="icon" aria-hidden="true">
                <use xlinkHref={`#${icon}`} />
              </svg>
          }
        </Button>
      </div>
    );
  }
}