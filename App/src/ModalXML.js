import React from 'react';
import beautify from 'xml-beautifier';

import { Modal, Button } from 'antd';

class ModalXML extends React.Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }



  render() {
    var xmlFormated
    if(this.props.xml !== null){
      xmlFormated = beautify(this.props.xml)
    }
    else{
      xmlFormated = ''
    }

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>XML</Button>
        <Modal
          title="xml data"
          visible={this.state.visible}
          footer={[
            <Button key="ok" type="primary" size="large" onClick={this.handleOk}>
              ok
            </Button>,
          ]}
        >
          <div>{xmlFormated}</div>

        </Modal>
      </div>
    );
  }
}

export default ModalXML;
