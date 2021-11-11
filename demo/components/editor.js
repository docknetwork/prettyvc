import React, {Component} from 'react';
import JSONEditor from 'jsoneditor';

export default class JSONEditorDemo extends Component {
  componentDidMount() {
    this.jsoneditor = new JSONEditor(this.container, {
      mode: 'code',
      onChangeText: this.onChange.bind(this),
    });
    this.jsoneditor.set(this.props.value);
  }

  onChange(e) {
    this.props.onChange(JSON.parse(e));
  }

  componentWillUnmount() {
    if (this.jsoneditor) {
      this.jsoneditor.destroy();
    }
  }

  componentDidUpdate() {
    this.jsoneditor.update(this.props.value);
  }

  render() {
    return (
        <div className="jsoneditor-react-container" ref={elem => this.container = elem} />
    );
  }
}
