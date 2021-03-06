import React, { Component } from "react";
import CardMenu from "../cardmenuandsnack/cardmenuandsnack";
import "./menuandsnack.css";
import { getFoodOrSnack } from "../api/api";
import propTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { currentOrder } from "../../actions/authActions";

class MenuAndSnack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: {},
      isLoaded: false,
      firstImg: 0
    };
    this.checkFirstMenuSet = this.checkFirstMenuSet.bind(this);
    this.checkLastMenuSet = this.checkLastMenuSet.bind(this);
    this.leftClick = this.leftClick.bind(this);
    this.rightClick = this.rightClick.bind(this);
  }

  componentDidMount() {
    const GetFood = getFoodOrSnack.bind(
      this,
      "menus",
      "isLoaded",
      this.props.path
    );
    GetFood();
    this.props.currentOrder();
  }

  rightClick(e) {
    this.setState({
      firstImg: this.state.firstImg + 6
    });
    e.preventDefault();
  }

  leftClick(e) {
    this.setState({
      firstImg: this.state.firstImg - 6
    });
    e.preventDefault();
  }

  checkFirstMenuSet() {
    let img = "";
    if (this.state.firstImg - 6 >= 0) {
      img = (
        <img
          src="/img/other/left-arrow.png"
          alt="left arrow icon"
          height="20"
        />
      );
    }
    return img;
  }

  checkLastMenuSet() {
    let img = "";
    if (
      this.state.firstImg + 6 < this.state.menus.length &&
      this.state.menus.length > 0
    ) {
      img = (
        <img
          className="imgbutton"
          src="/img/other/right-arrow.png"
          alt="right arrow icon"
          height="20"
        />
      );
    }
    return img;
  }

  onMenuCardDeleted(index) {
    const newMenus = this.state.menus.slice();
    newMenus.splice(index, 1);
    this.setState({
      menus: newMenus
    });
  }

  render() {
    const { isLoaded, menus, firstImg } = this.state;

    if (!isLoaded) {
      return <div className="loader" />;
    }

    const col1 = [],
      col2 = [];
    if (isLoaded) {
      for (let i = firstImg; i < firstImg + 3; i++) {
        if (i < menus.length) {
          const card_col1 = (
            <div className="col-sm-4 menuzone__image--fix" key={i}>
              <CardMenu
                name={menus[i][this.props.name]}
                picture={menus[i].img_url}
                calories={menus[i].calories}
                id={menus[i]._id}
                price={menus[i].price}
                onMenuCardDeleted={this.onMenuCardDeleted.bind(this, firstImg)}
                path={this.props.path}
                path_detail={this.props.path_detail}
              />
            </div>
          );
          col1.push(card_col1);
        }
        if (i + 3 < menus.length) {
          const card_col2 = (
            <div className="col-sm-4 menuzone__image--fix" key={i + 3}>
              <CardMenu
                name={menus[i + 3][this.props.name]}
                picture={menus[i + 3].img_url}
                calories={menus[i + 3].calories}
                id={menus[i + 3]._id}
                price={menus[i + 3].price}
                onMenuCardDeleted={this.onMenuCardDeleted.bind(this, firstImg)}
                path={this.props.path}
                path_detail={this.props.path_detail}
              />
            </div>
          );
          col2.push(card_col2);
        }
      }
    }

    const menuShow = (
      <div>
        <div className="row full">{col1}</div>
        <div className="row full">{col2}</div>
      </div>
    );
    return (
      <div
        id="carouselExampleControls"
        data-interval={false}
        className="carousel slide"
        data-ride="carousel"
      >
        <div className="menuzone">
          <div className="mergerow--left">
            <a href="#carouselExampleControls" role="button" data-slide="prev">
              <div onClick={this.leftClick.bind(this)}>
                {this.checkFirstMenuSet()}
              </div>
            </a>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item full-height active">{menuShow}</div>
            <div className="carousel-item full-height">{menuShow}</div>
            <div className="carousel-item full-height">{menuShow}</div>
          </div>

          <div className="mergerow--right">
            <a href="#carouselExampleControls" role="button" data-slide="next">
              <div onClick={this.rightClick.bind(this)}>
                {this.checkLastMenuSet()}
              </div>
            </a>
          </div>
          <div />
        </div>
      </div>
    );
  }
}

MenuAndSnack.propTypes = {
  auth: propTypes.object.isRequired,
  errors: propTypes.object.isRequired,
  currentOrder: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  order: state.errors
});

export default connect(
  mapStateToProps,
  { currentOrder }
)(withRouter(MenuAndSnack));
