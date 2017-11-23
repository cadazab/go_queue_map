import React from 'react';
import Client from './Client'
import { Select} from 'antd';
const Option = Select.Option;

class InputSelect extends React.Component{
  state = {
  }

  handleChange = (event) => {
    console.log(this.props.port);
    Client.getDataFromServer(`/updateInput/${this.props.schema}/${this.props.table}/${this.props.rowKey}/${this.props.primaryKeyTable}/${event}`,
    this.props.port,(data) => {
      console.log(data);
    })
  }

  render(){
    return(
      <Select
        showSearch
        defaultValue={this.props.inputfield}
        style={{width: '400px', margin: 0}}
        onChange={this.handleChange}
        >
        <Option value='null'>NULL</Option>
        {this.props.inputfieldOptions}
      </Select>
    )
  }
}

export default InputSelect;
