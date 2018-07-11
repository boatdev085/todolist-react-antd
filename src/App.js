import React, { Component } from "react";
import "./App.css";
import {
  Icon,
  List,
  Checkbox,
  Divider,
  Modal,
  Input,
  notification
} from "antd";
import Moment from "moment";
const confirm = Modal.confirm;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      description: "",
      title: "",
      editdata: null,
      data: []
    };
  }
  componentDidMount() {
    if (typeof Storage !== "undefined") {
      console.log("boat", localStorage.getItem("datatodolist") || []);

      this.setState({
        data: JSON.parse(localStorage.getItem("datatodolist")) || []
      });
    }
  }
  showmodal = () => {
    console.log("boat", localStorage.getItem("datatodolist"));
    this.setState({
      visible: true
    });
  };

  showConfirmdelete = item => {
    const statedata = this;
    confirm({
      title: `Delete Reminders ?`,
      content: `Delete taskid = ${item.taskid}`,
      onOk() {
        statedata.deletedata(item);
      },
      onCancel() {}
    });
  };

  handleOk = e => {
    let datanew = [];
    if (this.state.editdata) {
      datanew = this.state.data.map(item => {
        if (item.taskid === this.state.editdata) {
          item.title = this.state.title;
          item.description = this.state.description;
        }
        return item;
      });
      notification["success"]({
        message: "Edit data ok ",
        description: `Edit data taskid ${this.state.editdata}`
      });
    } else {
      let item = {
        // taskid: this.state.data.length + 1,
        taskid:
          this.state.data.length > 0
            ? this.state.data.slice(-1)[0].taskid + 1
            : 1,
        title: this.state.title,
        description: this.state.description,
        date: Moment(),
        status: false
      };
      datanew = [...this.state.data, item];

      notification["success"]({
        message: "Add data ok ",
        description: `Add data taskid ${item.taskid}`
      });
    }

    this.setState({
      data: datanew,
      visible: false,
      title: "",
      description: "",
      editdata: null
    });
    if (typeof Storage !== "undefined") {
      localStorage.setItem("datatodolist", JSON.stringify(datanew));
    }
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      title: "",
      description: "",
      editdata: null
    });
  };
  rendersuccess(arr, status) {
    let success = 0;
    let progress = 0;
    arr.map(item => {
      if (item.status) {
        success += 1;
      } else {
        progress += 1;
      }
      return item;
    });
    return status ? success : progress;
  }
  headerlist = () => {
    return (
      <div className="reminders">
        <div className="left">
          <h1>Reminders</h1>
        </div>
        <div className="right">
          <h1>
            <Icon
              type="plus-square-o"
              style={{ color: "gray", cursor: "pointer" }}
              onClick={() => this.showmodal()}
            />
          </h1>
        </div>
        <Divider />
        <div className="reminders">
          <div className="left">
            <h3>{`${this.rendersuccess(this.state.data, true)} Completed`}</h3>
          </div>
          <div className="right">
            <h3>
              <Icon type="right" style={{ color: "gray" }} />
            </h3>
          </div>
        </div>
      </div>
    );
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  checkchange = id => {
    let newdata = this.state.data.map(item => {
      if (item.taskid === id) {
        item.status = !item.status;
      }
      return item;
    });
    this.setState({ data: newdata });
  };
  editdata = item => {
    this.setState({
      visible: true,
      title: item.title,
      description: item.description,
      editdata: item.taskid
    });
  };
  deletedata = item => {
    this.setState({
      data: this.state.data.filter(data => data.taskid !== item.taskid)
    });
    notification["success"]({
      message: "Delete data ok ",
      description: `Delete data taskid ${item.taskid}`
    });
  };
  sortarraytop(arr) {
    let arr2 = [];
    arr.map(item => {
      return arr2.unshift(item);
    });
    return arr2;
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div style={{ marginTop: 50 }}>
            <List
              header={this.headerlist()}
              bordered
              dataSource={this.sortarraytop(this.state.data)}
              renderItem={item => (
                <List.Item
                  style={{ textAlign: "left" }}
                  actions={[
                    <a onClick={() => this.editdata(item)}>Edit</a>,
                    <a onClick={() => this.showConfirmdelete(item)}>Delete</a>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div>
                        <Checkbox
                          value={item.taskid}
                          defaultChecked={item.status}
                          onChange={() => this.checkchange(item.taskid)}
                        />
                        {/* <Divider type="vertical" /> */}
                      </div>
                    }
                    title={
                      <a style={{ textAlign: "left" }}>
                        {" "}
                        {item.title}{" "}
                        {item.status ? (
                          <Icon
                            type="check-square"
                            style={{ fontSize: 16, color: "green" }}
                          />
                        ) : (
                          <Icon
                            type="close-square"
                            style={{ fontSize: 16, color: "green" }}
                          />
                        )}
                      </a>
                    }
                    description={`${item.description} ${Moment(
                      item.date
                    ).format("d MMM YYYY")}`}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
        <Modal
          title={` ${
            !this.state.editdata
              ? `Add New Reminders new tarkid = ${
                  this.state.data.length > 0
                    ? this.state.data.slice(-1)[0].taskid + 1
                    : 1
                }`
              : `Edit Reminders tarkid = ${this.state.editdata || 1}`
          }`}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div style={{ marginBottom: 16 }}>
            <Input
              addonBefore="Title:"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input
              name="description"
              addonBefore="Description:"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
