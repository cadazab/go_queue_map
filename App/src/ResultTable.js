import React from 'react';
import { Table, Spin } from 'antd';

class ResultTable extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: null,
    };

  }

  setData = () => {
    this.setState({data: this.props.dataTable})
  }



  render(){

    var columns = [];
    var data = [];

    if(this.props.columnsTable !==  null && this.props.dataTable !== null){
      this.props.columnsTable.forEach((element)=>{
        var width;
        if(element.name === "Inputfield"){
          width = '400px'
          columns.push({
            title: element.name,
            dataIndex: element.name,
            width: width,

          })
        }else if (element.name === "Outputfield") {
          width = '300px'
          columns.push({
            title: element.name,
            dataIndex: element.name,
            width: width,
          })
        }

        else{
          width = '60px'
          columns.push({
            title: element.name,
            dataIndex: element.name,
            width: width,
          })
        }

      })

      data = this.props.dataTable


      return(
        <Table columns={columns} dataSource={data}
          pagination={false} scroll={{ y: 700,  }} size='small'/>
      )
    }else{
      return  <div className="load"><Spin size="large"/></div>
    }


  }
}

export default ResultTable;
