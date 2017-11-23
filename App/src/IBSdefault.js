import React from 'react';
import Client from './Client';
import {Input} from 'antd';



class IBSdefault extends React.Component {

  handleChange = (event) => {

    let value = event.target.value;
    if(value === ''){value = 'null'}
    Client.getDataFromServer(`/updateIBSdefault/${this.props.schema}/${this.props.table}/${this.props.rowKey}/${this.props.primaryKeyTable}/${value}`,
    this.props.port,(data) => {
      console.log(data);
    })
  }

  render(){
    return(
      <Input style={{width: '100px'}}
        defaultValue={this.props.ibsDefault} onBlur={this.handleChange}/>
    )
  }
}

export default IBSdefault;
