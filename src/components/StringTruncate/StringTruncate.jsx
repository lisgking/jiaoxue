import React, { Component } from 'react';
import sizeMe from 'react-sizeme';
import styled from 'styled-components';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';


const StringTruncateWrapper = styled.div`
  ${(props) => {
    return (
      props.maxHeight ? `
        max-height: ${`${props.maxHeight + 2}px`};
        overflow: hidden;
      ` : ''
    )
    ;
  }}
  `;
@withSizeChangeAware
@sizeMe({
  monitorWidth: true,
  monitorHeight: true,
})
class StringTruncate extends Component {
  render() {
    return (
      <div {...this.props}>
        {
          this.props.children
        }
      </div>
    );
  }
}


function withSizeChangeAware(WrappedComponent) {
  class ExtendedComponent extends Component {
    ref = React.createRef();

    onSize = (size) => {
      const { maxHeight, truncateTargetSelector, maxWidth, defaultTitleVisible = true, overFlowHandler } = this.props;
      const { height, width } = size;
      if (!this.tobeEllipseEl) {
        this.wrapEl = this.ref.current.domEl;
        this.tobeEllipseEl = this.wrapEl.querySelector(truncateTargetSelector);
        this.originString = this.tobeEllipseEl && this.tobeEllipseEl.innerText;
      }
      if (maxHeight) {
        if (height >= maxHeight) {
          this.truncateString();
          if (defaultTitleVisible) {
            this.tobeEllipseEl.title = this.originString;
          }
          if (typeof overFlowHandler === 'function') {
            overFlowHandler();
          }
        }
      }
      if (maxWidth) {
        if (width >= maxWidth) {
          this.wrapEl.setAttribute('style', `max-width: ${maxWidth}px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`);
          this.wrapEl.setAttribute('title', `${this.wrapEl.innerText}`);
          if (typeof overFlowHandler === 'function') {
            overFlowHandler();
          }
        }
      }
    }

    truncateString() {
      let truncateNum = 0;
      while (this.wrapEl.getBoundingClientRect().height > this.props.maxHeight) {
        truncateNum += 6;
        this.tobeEllipseEl.innerText = `${this.originString.slice(0, -truncateNum)}...`;
      }
    }

    render() {
      return <WrappedComponent ref={this.ref} onSize={this.onSize} {...this.props} />;
    }
  }

  return ExtendedComponent;
}

export default StringTruncate;

