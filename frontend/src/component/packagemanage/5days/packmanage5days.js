import React, {Component} from 'react';
import '../packagemanage.css';
import { DropTarget } from "react-drag-drop-container";
import { setMenuDrop } from '../helper';
import axios from "axios";
import NutritionManage from "../nutritionmanage"
import propTypes from 'prop-types';
import { connect } from 'react-redux';


class Packagemanage5days extends Component {

  constructor(props) {
    super(props);
    this.state = {
      day1_img: [<img className="card-img" src="../img/package/blank.PNG" alt="blank" />, <img className="card-img" src="../img/package/blank.PNG" alt="blank"/>],
      day2_img: [<img className="card-img" src="../img/package/blank.PNG" alt="blank"/>, <img className="card-img" src="../img/package/blank.PNG" alt="blank"/>],
      day3_img: [<img className="card-img" src="../img/package/blank.PNG" alt="blank" />, <img className="card-img" src="../img/package/blank.PNG" alt="blank"/>],
      day4_img: [<img className="card-img" src="../img/package/blank.PNG" alt="blank"/>, <img className="card-img" src="../img/package/blank.PNG" alt="blank"/>],
      day5_img: [<img className="card-img" src="../img/package/blank.PNG" alt="blank"/>, <img className="card-img" src="../img/package/blank.PNG" alt="blank"/>],
      day1_detail: [],
      day2_detail: [],
      day3_detail: [],
      day4_detail: [],
      day5_detail: [],
      all_detail: [],
      isLoaded: false,
      sum_price: 0,
      isReadyToShow: [false, false, false, false, false, false, false, false, false, false],
      user: null,
      name_package: "",
      description: "",
      package_id: "",
    };
    this.send5DaysPackage = this.send5DaysPackage.bind(this)
    this.onSendMenuDetail = this.onSendMenuDetail.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  
  componentDidMount() {
    axios.get("/api/users/profile")
      .then(res => {
        this.setState({
          user: res.data.user_name
        });
      })
      .then(() => {
        console.log(this.state.user);
      });
  }
  
  onSendMenuDetail() {
    const newAllDetail = [ 
      this.state.day1_detail, 
      this.state.day2_detail,
      this.state.day3_detail,
      this.state.day4_detail,
      this.state.day5_detail
    ];
    this.setState({
      all_detail: newAllDetail,
      isLoaded: true,
      sum_price: Math.round((this.state.day1_detail[0].price + this.state.day1_detail[1].price +
                  this.state.day2_detail[0].price + this.state.day2_detail[1].price +
                  this.state.day3_detail[0].price + this.state.day3_detail[1].price +
                  this.state.day4_detail[0].price + this.state.day4_detail[1].price +
                  this.state.day5_detail[0].price + this.state.day5_detail[1].price) * 0.95)
    },() => { 
    console.log("this is from package")
    })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
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
    console.log("price ", this.state.sum_price)
    return <div />;
  }

  send5DaysPackage(path) {
    console.log(path + " package")
    const newPackage = {
      package_id: this.state.package_id,
      name_package: this.state.name_package,
      description: this.state.description,
      type: 5,
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
        },
        {
          meal_1: this.state.day4_detail[0],
          meal_2: this.state.day4_detail[1]
        },
        {
          meal_1: this.state.day5_detail[0],
          meal_2: this.state.day5_detail[1]
        },],
      price: this.state.sum_price
    };
    axios.post("/api/packages/" + path, newPackage)
      .then(response => {
        console.log("res",response);
        if(path == "add"){
					console.log("save")
					alert("Save Package success!");
				}
				else if(path == "anonymous/addcart") {
					this.setState({
						package_id: response.data.data.package_id
					})
					alert("Add to cart success!")
				}
			})
      .catch(function (error) {
        console.log(error);
      })
  }

	render() {
    const { isAuthenticated, user} = this.props.auth;
    const users = (
      <div></div>
    )
    const admin = (
      <div className="row">
                  <label className="col-sm-4">
                    Description:
                  </label>
                  <div className="col-sm-6">
                    <textarea className="form-control"
                    placeholder="description"
                    type="text"
                    name="description"
                    id="description"
                    onChange={this.handleChange}
                    value={this.state.description}/>
                  </div>
                </div>
    )
		return <React.Fragment>
        <div className="packagemanage-box ">
          <div className="row">
            <div className="col-sm card-package">
              DAY 1<div className="row">
                <div className="col card-pack-img">
                  <DropTarget targetKey="menu" onHit={setMenuDrop.bind(this, "day1_img", "day1_detail", "isReadyToShow", 0, 0)}>
                    {this.state.day1_img[0]}
                  </DropTarget>
                </div>
                <div className="col card-pack-img">
                  <DropTarget targetKey="menu" onHit={setMenuDrop.bind(this, "day1_img", "day1_detail", "isReadyToShow", 1, 1)}>
                    {this.state.day1_img[1]}
                  </DropTarget>
                </div>
              </div>
            </div>
            <div className="col-sm card-package">
              DAY 2<div className="row">
                <div className="col card-pack-img">
                  <DropTarget targetKey="menu" onHit={setMenuDrop.bind(this, "day2_img", "day2_detail", "isReadyToShow", 0, 2)}>
                    {this.state.day2_img[0]}
                  </DropTarget>
                </div>
                <div className="col card-pack-img">
                  <DropTarget targetKey="menu" onHit={setMenuDrop.bind(this, "day2_img", "day2_detail", "isReadyToShow", 1, 3)}>
                    {this.state.day2_img[1]}
                  </DropTarget>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm card-package">
              DAY 3<div className="row">
                <div className="col card-pack-img">
                  <DropTarget targetKey="menu" onHit={setMenuDrop.bind(this, "day3_img", "day3_detail", "isReadyToShow", 0, 4)}>
                    {this.state.day3_img[0]}
                  </DropTarget>
                </div>
                <div className="col card-pack-img">
                  <DropTarget targetKey="menu" onHit={setMenuDrop.bind(this, "day3_img", "day3_detail", "isReadyToShow", 1, 5)}>
                    {this.state.day3_img[1]}
                  </DropTarget>
                </div>
              </div>
            </div>
            <div className="col-sm card-package">
              DAY 4<div className="row">
                <div className="col card-pack-img">
                  <DropTarget targetKey="menu" onHit={setMenuDrop.bind(this, "day4_img", "day4_detail", "isReadyToShow", 0, 6)}>
                    {this.state.day4_img[0]}
                  </DropTarget>
                </div>
                <div className="col card-pack-img">
                  <DropTarget targetKey="menu" onHit={setMenuDrop.bind(this, "day4_img", "day4_detail", "isReadyToShow", 1, 7)}>
                    {this.state.day4_img[1]}
                  </DropTarget>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-3-sm col-set" />
            <div className="col-sm card-last-package ">
              DAY 5<div className="row">
                <div className="col card-pack-img">
                  <DropTarget targetKey="menu" onHit={setMenuDrop.bind(this, "day5_img", "day5_detail", "isReadyToShow", 0, 8)}>
                    {this.state.day5_img[0]}
                  </DropTarget>
                </div>
                <div className="col card-pack-img">
                  <DropTarget targetKey="menu" onHit={setMenuDrop.bind(this, "day5_img", "day5_detail", "isReadyToShow", 1, 9)}>
                    {this.state.day5_img[1]}
                  </DropTarget>
                </div>
              </div>
            </div>
            <div className="col-3-sm col-set" />
          </div>
          {this.checkReady()}

          {this.state.all_detail && this.state.all_detail.length > 0 && this.state.isLoaded && <React.Fragment>
            <div>
              <form>
                <div className="row">
                  <label className="col-sm-4">
                    Package name:
                  </label>
                  <div className="col-sm-6">
                    <input className="form-control"
                    placeholder="Please name your package before save"
                    type="text"
                    name="name_package"
                    id="name_package"
                    onChange={this.handleChange}
                    value={this.state.name_package}/>
                  </div>
                </div>
                <br/>
                <div>
                  {isAuthenticated? users : ""}
                  {user.type? admin : ""}
                </div>
              </form>
            </div>
                <div>
                  <NutritionManage menu_detail={this.state.all_detail} />
                </div>
                <div>
                    <button
                      className="btn btn-shownutrition"
                      onClick={() => this.send5DaysPackage("anonymous/addcart")}
                    >
                      ADD TO CART
                      </button>
                  <button
                    className="btn btn-shownutrition"
                    onClick={() => this.send5DaysPackage("add")}
                  >
                    SAVE PACKAGE
                  </button>
                </div>
              </React.Fragment>}
        </div>
      </React.Fragment>;
	}
}

Packagemanage5days.propTypes = {
  auth: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Packagemanage5days);
