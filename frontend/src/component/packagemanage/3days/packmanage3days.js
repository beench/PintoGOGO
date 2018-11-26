import React, { Component } from "react";
import "../packagemanage.css";
import { DropTarget } from "react-drag-drop-container";
import { setMenuDrop } from "../helper";
import axios from "axios";
import NutritionManage from "../nutritionmanage";
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfile } from "../../api/api";

class Packagemanage3days extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day1_img: [
        <img className="card-img" src="../img/package/blank.PNG" alt="blank" />,
        <img className="card-img" src="../img/package/blank.PNG" alt="blank" />
      ],
      day2_img: [
        <img className="card-img" src="../img/package/blank.PNG" alt="blank" />,
        <img className="card-img" src="../img/package/blank.PNG" alt="blank" />
      ],
      day3_img: [
        <img className="card-img" src="../img/package/blank.PNG" alt="blank" />,
        <img className="card-img" src="../img/package/blank.PNG" alt="blank" />
      ],
      day1_detail: [],
      day2_detail: [],
      day3_detail: [],
      all_detail: [],
      sum_price: 0,
      isReadyToShow: [false, false, false, false, false, false],
      user: null,
      show_nutrition: <div />,
      name_package: "",
      description: "",
      package_id: ""
    };
    this.send3DaysPackage = this.send3DaysPackage.bind(this);
    this.onSendMenuDetail = this.onSendMenuDetail.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
      const get_user = getProfile.bind(this,"user","");
      get_user();
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  send3DaysPackage(path) {
    console.log(path + " package");
    const newPackage = {
      package_id: this.state.package_id,
      name_package: this.state.name_package,
      description: this.state.description,
      type: 3,
      day_meal: [
        {
          meal_1: this.state.day1_detail[0],
          meal_2: this.state.day1_detail[1]
        },
        {
          meal_1: this.state.day2_detail[0],
          meal_2: this.state.day2_detail[1]
        },
        {
          meal_1: this.state.day3_detail[0],
          meal_2: this.state.day3_detail[1]
        }
      ],
      price: this.state.sum_price
    };
    axios
      .post("/api/packages/" + path, newPackage)
      .then(response => {
        console.log("res", response);
        if (path == "add") {
          console.log("save");
          this.setState({
            package_id : response.data.data.package_id
          })
          alert("Save Package Success!");
        } else if (path == "addcart") {
          this.setState({
            package_id: response.data.data.package_id
          });
          alert("Add to cart success!");
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  onSendMenuDetail() {
    const newAllDetail = [
      this.state.day1_detail,
      this.state.day2_detail,
      this.state.day3_detail
    ];
    this.setState({
      all_detail: newAllDetail,
      sum_price: Math.round(
        (this.state.day1_detail[0].price +
          this.state.day1_detail[1].price +
          this.state.day2_detail[0].price +
          this.state.day2_detail[1].price +
          this.state.day3_detail[0].price +
          this.state.day3_detail[1].price) *
          0.95
      )
    });
  }

  checkReady() {
    let all_ready = true;
    this.state.isReadyToShow.map((ready, index) => {
      if (!ready) {
        all_ready = false;
      }
    });
    console.log(all_ready);
    if (all_ready) {
      return (
        <button
          className="btn btn-shownutrition"
          onClick={this.onSendMenuDetail}
        >
          CLICK TO SHOW NUTRITION
        </button>
      );
    }
    console.log("price ", this.state.sum_price);
    return <div />;
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const users = <div />;
    const admin = (
      <div className="row">
        <label className="col-sm-4">Description:</label>
        <div className="col-sm-6">
          <textarea
            className="form-control"
            placeholder="description"
            type="text"
            name="description"
            id="description"
            onChange={this.handleChange}
            value={this.state.description}
          />
        </div>
      </div>
    );

    return (
      <React.Fragment>
        <div className="packagemanage-box ">
          <div className="row">
            <div className="col-sm card-package">
              DAY 1
              <div className="row">
                <div className="col card-pack-img">
                  <DropTarget
                    targetKey="menu"
                    onHit={setMenuDrop.bind(
                      this,
                      "day1_img",
                      "day1_detail",
                      "isReadyToShow",
                      0,
                      0
                    )}
                  >
                    {this.state.day1_img[0]}
                  </DropTarget>
                </div>
                <div className="col card-pack-img">
                  <DropTarget
                    targetKey="menu"
                    onHit={setMenuDrop.bind(
                      this,
                      "day1_img",
                      "day1_detail",
                      "isReadyToShow",
                      1,
                      1
                    )}
                  >
                    {this.state.day1_img[1]}
                  </DropTarget>
                </div>
              </div>
            </div>
            <div className="col-sm card-package">
              DAY 2
              <div className="row">
                <div className="col card-pack-img">
                  <DropTarget
                    targetKey="menu"
                    onHit={setMenuDrop.bind(
                      this,
                      "day2_img",
                      "day2_detail",
                      "isReadyToShow",
                      0,
                      2
                    )}
                  >
                    {this.state.day2_img[0]}
                  </DropTarget>
                </div>
                <div className="col card-pack-img">
                  <DropTarget
                    targetKey="menu"
                    onHit={setMenuDrop.bind(
                      this,
                      "day2_img",
                      "day2_detail",
                      "isReadyToShow",
                      1,
                      3
                    )}
                  >
                    {this.state.day2_img[1]}
                  </DropTarget>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-3-sm col-set" />
            <div className="col-sm card-last-package ">
              DAY 3
              <div className="row">
                <div className="col card-pack-img">
                  <DropTarget
                    targetKey="menu"
                    onHit={setMenuDrop.bind(
                      this,
                      "day3_img",
                      "day3_detail",
                      "isReadyToShow",
                      0,
                      4
                    )}
                  >
                    {this.state.day3_img[0]}
                  </DropTarget>
                </div>
                <div className="col card-pack-img">
                  <DropTarget
                    targetKey="menu"
                    onHit={setMenuDrop.bind(
                      this,
                      "day3_img",
                      "day3_detail",
                      "isReadyToShow",
                      1,
                      5
                    )}
                  >
                    {this.state.day3_img[1]}
                  </DropTarget>
                </div>
              </div>
            </div>
            <div className="col-3-sm col-set" />
          </div>

          {this.checkReady()}

          {this.state.all_detail && this.state.all_detail.length > 0 && (
            <React.Fragment>
              <div>
                <form>
                  <div className="row">
                    <label className="col-sm-4">Package name:</label>
                    <div className="col-sm-6">
                      <input
                        className="form-control"
                        placeholder="Please name your package before save"
                        type="text"
                        name="name_package"
                        id="name_package"
                        onChange={this.handleChange}
                        value={this.state.name_package}
                      />
                    </div>
                  </div>
                  <br />
                  <div>
                    {isAuthenticated ? users : ""}
                    {user.type ? admin : ""}
                  </div>
                </form>
              </div>
              <div>
                <NutritionManage menu_detail={this.state.all_detail} />
              </div>
              <div>
                {/* <a href="/cart"> */}
                <button
                  className="btn btn-shownutrition"
                  onClick={() => this.send3DaysPackage("addcart")}
                >
                  ADD TO CART
                </button>
                {/* </a> */}
                <button
                  className="btn btn-shownutrition" // onClick={this.testClick()}
                  onClick={() => this.send3DaysPackage("add")}
                >
                  SAVE PACKAGE
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

Packagemanage3days.propTypes = {
  auth: propTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Packagemanage3days);
