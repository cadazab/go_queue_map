import React from 'react';

import InputForm from './InputForm'
import ResultTable from './ResultTable'
import Client from './Client'
import ModalXML from './ModalXML'
import InputSelect from './InputSelect'
import IBSdefault from './IBSdefault'

import { Layout, Select, Form} from 'antd';
const Option = Select.Option;
const { Header, Content } = Layout;
const InputHeader = Form.create()(InputForm);

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      webquenr: null,
      schema: 'wq',
      table: null,
      inputfieldOptions: null,
      columnsTable: null,
      primaryKeyTable: null,
      dataTable: null,
      submit: null,
      outputfieldFilter: 'empty',
      ibsFilter: 'empty',
      orderBy: 'Outputfield',
      ascOrDesc: 'asc',
      port: '3007',
      mappingOptions: null,
      mapping: null
    }

    this.getMappingOptions();

  }

  getMappingOptions = () => {
    Client.getDataFromServer('/getMappingOptions',this.state.port,(data) => {
      const options = data.map((value, index)=>{
        return <Option key={index} value={value.Mapping_Nr.toString()}>{value.Mapping}</Option>
      })
      this.setState({mappingOptions: options})
    })
  }

  handleMappingChange = (event) => {
    this.setState({mapping: event})
  }


  handleEnviromentChange = (event) => {
    this.setState({port: event})
  }

  handleWebquenrChange = (event) => {
    let webquenr = event.target.value
    Client.getDataFromServer('/inputOptions/'+webquenr,this.state.port,
    (data) => {
      console.log(data)
      const options = data.map((value,index)=>{
        var str = `${value.name}  (${value.value})`
        return <Option key={index} value={value.name}>{str}</Option>
      })
      this.setState({inputfieldOptions: options})
    })
  }

  handleTableNameChange = (event) => {
    this.setState({table: event})
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({submit: 1, columnsTable: null, dataTable: null})
    Client.getDataFromServer('/Columns/'+this.state.schema+'/'+this.state.table,
    this.state.port,(data) => {
      this.setState({primaryKeyTable: data[0].name, columnsTable: data})
    })
    Client.getDataFromServer('/loadData/'+this.state.schema+'/'+this.state.table+
                            '/'+this.state.mapping+
                            '/'+this.state.outputfieldFilter+
                            '/'+this.state.ibsFilter+
                            '/'+this.state.orderBy+
                            '/'+this.state.ascOrDesc,this.state.port,(data) => {

      data.forEach((element, index)=>{

        element.Inputfield = <InputSelect
                              inputfield = {element.Inputfield}
                              inputfieldOptions = {this.state.inputfieldOptions}
                              schema = {this.state.schema}
                              port = {this.state.port}
                              table = {this.state.table}
                              primaryKeyTable = {this.state.primaryKeyTable}
                              rowKey = {element[this.state.primaryKeyTable]}
                             />

        element.lookup_xml = <ModalXML  xml={element.lookup_xml} />

        element.IBSdefault = <IBSdefault
                              ibsDefault={element.IBSdefault}
                              schema = {this.state.schema}
                              port = {this.state.port}
                              table = {this.state.table}
                              primaryKeyTable = {this.state.primaryKeyTable}
                              rowKey = {element[this.state.primaryKeyTable]}
                             />


      })

      this.setState({dataTable: data})
    })
  }

  handleOutputfieldFilter = (event) => {
    var value = event.target.value
    if(value === ''){value = 'empty'}
    this.setState({outputfieldFilter: value})
  }

  handleIBSfilter = (event) => {
    var value = event.target.value
    if(value === ''){value = 'empty'}
    this.setState({ibsFilter: value})
  }

  handleOrderByChange = (event) => {
    this.setState({orderBy: event})
  }

  handleAscOrDescChange = (event) => {
    this.setState({ascOrDesc: event})
  }

  render() {

    var table
    if(this.state.submit !== null){
      table =<ResultTable
        columnsTable={this.state.columnsTable}
        dataTable={this.state.dataTable}
        modalVisible={this.state.modalVisible}
      />;
    }else{
      table = <div></div>
    }

    return (

        <Layout>
          <Header style={{ height: 60, background: '#cdcde4' }} >
            <InputHeader
               mappingOptions={this.state.mappingOptions}
               handleMappingChange={this.handleMappingChange}
               handleEnviromentChange={this.handleEnviromentChange}
               handleTableNameChange={this.handleTableNameChange}
               handleWebquenrChange={this.handleWebquenrChange}
               handleOrderByChange={this.handleOrderByChange}
               handleAscOrDescChange={this.handleAscOrDescChange}
               handleSubmit = {this.handleSubmit}
               handleOutputfieldFilter = {this.handleOutputfieldFilter}
               handleIBSfilter = {this.handleIBSfilter}
               columnsTable = {this.state.columnsTable}
            />
          </Header>
          <Content>
            {table}
          </Content>

        </Layout>

    );
  }
}

export default App;