import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class CustomReactQuill extends React.Component {
  render() {
    return <ReactQuill {...this.props} />;
  }
}

export default CustomReactQuill;
