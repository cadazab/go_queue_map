import React from 'react';
import { Form, Input, Button, Select } from 'antd';
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class InputForm extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const webquenrError = isFieldTouched('webquenr') && getFieldError('webquenr');
    const tableNameError = isFieldTouched('tableName') && getFieldError('tableName');
    const mappingError = isFieldTouched('mapping') && getFieldError('mapping');

    /*
    const orderByAfter = (
      <Select>
        <Option value='asc'>asc</Option>
        <Option value='desc'>desc</Option>
      </Select>
    );
    */

    var options
    if(this.props.columnsTable !== null){
      options = this.props.columnsTable.map((value, index) => {
        return(
          <Option key={index} value={value.name}>{value.name}</Option>
        )
      })
    }else{
      options = <Option value='null'></Option>
    }

    return (
      <Form layout="inline" onSubmit={this.props.handleSubmit}>


        <FormItem>
          <Select
            style={{width: 120}}
            defaultValue="test"
            onChange={this.props.handleEnviromentChange}
          >
            <Option value="4000">Test</Option>
            <Option value="4001">Acceptance</Option>
            {/*<Option value="4002">Production</Option> */}
          </Select>
        </FormItem>

        <FormItem
          validateStatus={webquenrError ? 'error' : ''}
          help = {''}
        >
          {getFieldDecorator('webquenr', {
            rules: [{ required: true }],
          })(
            <Input placeholder="webquenr" onChange={this.props.handleWebquenrChange}/>
          )}
        </FormItem>

        <FormItem
          validateStatus={tableNameError ? 'error' : ''}
          help = {''}
        >
          {getFieldDecorator('tableName', {
            rules: [{ required: true }],
          })(
            <Select
              style={{width: 120}}
              onChange={this.props.handleTableNameChange}
              placeholder="Table"
            >
              <Option value="d_map_go">Map Go</Option>
              <Option value="d_map_ro">Map Ro</Option>
              <Option value="d_map_pt">Map PT</Option>
            </Select>
          )}

        </FormItem>

        <FormItem
          validateStatus={mappingError ? 'error' : ''}
          help = {''}>
          {getFieldDecorator('mapping', {
            rules: [{ required: true }],
          })(
          <Select
            style={{width: 300}}
            placeholder="Mapping"
            onChange={this.props.handleMappingChange}
          >
            {this.props.mappingOptions}
          </Select>
          )}
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Load Data
          </Button>
        </FormItem>

        <FormItem>
          <Search
            placeholder="Outputfield filter"
            style={{width: 150}}
            onChange = {this.props.handleOutputfieldFilter}
          />

          <Search
            placeholder="IBSdefault filter"
            style={{width: 150}}
            onChange={this.props.handleIBSfilter}
          />
        </FormItem>

        <FormItem>
            <span>Order By </span>
            <Select
              onChange={this.props.handleOrderByChange}
              style={{width: 120}}
              //onChange={this.props.handleTableNameChange}
              defaultValue='Outputfield'
            >
              {options}
            </Select>

            <Select onChange={this.props.handleAscOrDescChange}
              style={{width: 60}} defaultValue='asc'>
              <Option value='asc'>asc</Option>
              <Option value='desc'>desc</Option>
            </Select>
        </FormItem>

      </Form>
    );
  }
}

export default InputForm;
