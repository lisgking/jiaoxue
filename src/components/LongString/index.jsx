/**
 * @description 长文本多行溢出...展示组件。支持展开、收起功能；支持文件内关键字高亮显示
 * @author hbli
 * @date 2018/10/16
 */
import React, { Component, Fragment } from 'react';
import Utils from '../../lib/utils';
import './index.scss';

const isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
export default class LongString extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      isTooHeight: false,
      content: this.handleStr(this.props.content), // 去除空格、<br>等之后，传入的字符串
      strTemp: this.handleStr(this.props.content), // 处理后的展示的字符串
    };
  }
  static defaultProps = {
    lines: 1, // 行数
    lineHeight: 20, // 行高
    content: '', // 文本
    className: '', // 传入的类名
    showMore: false, // 是否支持展开、收起
    keyWord: '', // 关键字高亮
  }
  componentDidMount = () => {
    const { lines, lineHeight } = this.props;
    const { content } = this.props;

    if (isFireFox) {
      setTimeout(() => {
        const dom = this.newsContent.getBoundingClientRect();
        const str = this.handleText(dom);
        this.setState({ isTooHeight: dom.height > lines * lineHeight, strTemp: str });
      }, 1);
    } else {
      const dom = this.newsContent.getBoundingClientRect();
      const str = this.handleText(dom);
      this.setState({ isTooHeight: dom.height > lines * lineHeight, strTemp: str });
    }
  }
  handleStr = (content) => {
    if (!content) return '';
    let str = '';
    // 去除所有的空格
    str = content.replace(/\s*/g, '');
    // 去除所有的<br>
    const reg = new RegExp('<br>', 'gi');
    str = str.replace(reg, '');
    return str;
  }
  handleText = (pList) => {
    const { lines, lineHeight, showMore, keyWord } = this.props;
    let showContent = this.props.content;
    if (!showContent) return '';
    // 去除所有的空格
    showContent = showContent.replace(/\s*/g, '');
    // 去除所有的<br>
    const reg = new RegExp('<br>', 'gi');
    showContent = showContent.replace(reg, '');
    showContent = showContent.substring(0, lines * 20);
    let str = showContent;
    let index = 1;
    if (pList.height > lines * lineHeight) {
      for (let i = 1; i < showContent.length; i += 2) {
        str = showContent.substring(0, showContent.length - i);
        this.newsContent.innerText = str;
        if (this.newsContent.getBoundingClientRect().height <= lines * lineHeight) {
          index = i;
          break;
        }
      }
      if (!showMore) {
        index += 1;
      } else {
        // 预留出放展开、收起的位置
        index += 4;
      }
      str = `${showContent.slice(0, -index)}...`;
    }
    return keyWord ? Utils.highLightStr(str, keyWord) : str;
  }
  toggleLines = () => {
    const { expanded, strTemp, content } = this.state;
    this.setState({
      expanded: !expanded,
      // str: expanded ? strTemp : content,
    });
  }
  render() {
    const { showMore, lineHeight, className, keyWord } = this.props;
    const { expanded, isTooHeight, content, strTemp } = this.state;
    return (
      <div className="leng_string_container" >
        <div className={`card_item_content ${className}`} style={{ lineHeight: `${lineHeight}px` }} ref={(dom) => { this.newsContent = dom; }} dangerouslySetInnerHTML={{ __html: expanded ? content : strTemp }} />
        {showMore && isTooHeight && this.newsContent && !expanded && (
          <span> <a href="#" className="card_more_btn" onClick={this.toggleLines}>展开</a></span>
        )}
        {showMore && isTooHeight && this.newsContent && expanded && (
          <span> <a href="#" className="card_more_btn" onClick={this.toggleLines}>收起</a></span>
        )}
      </div>
    );
  }
}