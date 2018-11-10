import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HighLightString extends Component {
  static propTypes = {
    match: PropTypes.string,
    value: PropTypes.string,
  }
  static defaultProps = {
    match: '',
    value: '',
    hightLightClass: 'hightLight',
  }

  render() {
    const { match, value, hightLightClass } = this.props;
    let child;
    if (match === '') {
      child = value;
    } else {
      const result = value.split(match);
      if (result.length > 1) {
        child = [[]].concat(result).reduce((a, b, i, arr) => {
          const hightLight = <span key={`${i + hightLightClass}`} className={hightLightClass}>{match}</span>;
          if ((i === 1 && b === '') || (i === arr.length - 1 && b === '')) {
            a.push(hightLight);
          }
          a.push(b);
          return a;
        });
      } else {
        child = value;
      }
    }
    return (child);
  }
}

