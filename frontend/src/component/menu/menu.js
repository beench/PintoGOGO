import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button
} from "reactstrap";
import { Row } from "reactstrap";
import CardMenu from "../cardmenu/cardmenu";
import "../menu/menu.css";
import axios from 'axios'

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: {},
      isLoaded: false,
      firstImg: 0,
      secondImg: 1,
      thirdImg: 2,
      forthImg: 3,
      fifthImg: 4,
      sixthImg: 5,
      length_menu: 0
    };
    this.checkFirstMenuSet = this.checkFirstMenuSet.bind(this);
    this.checkLastMenuSet = this.checkLastMenuSet.bind(this);
    this.leftClick = this.leftClick.bind(this)
  }

  componentDidMount() {
    axios.get("/api/menus/food")
      .then(response => {
        this.setState({
          isLoaded: true,
          menus: response.data
        });
      })
      .then(this.setState({
        length_menu : Object.keys(this.state.menus).length
      }));
  }

  rightClick(e) {
    console.log("Click!!!!");
    this.setState({
      firstImg: this.state.firstImg + 6,
      secondImg: this.state.secondImg + 6,
      thirdImg: this.state.thirdImg + 6,
      forthImg: this.state.forthImg + 6,
      fifthImg: this.state.fifthImg + 6,
      sixthImg: this.state.sixthImg + 6
    });
    e.preventDefault();
  }

  leftClick(e) {
    console.log("Click!!!!");
    this.setState({
      firstImg: this.state.firstImg - 6,
      secondImg: this.state.secondImg - 6,
      thirdImg: this.state.thirdImg - 6,
      forthImg: this.state.forthImg - 6,
      fifthImg: this.state.fifthImg - 6,
      sixthImg: this.state.sixthImg - 6
    });
    e.preventDefault();
  }

  checkFirstMenuSet() {
    let img=""
    if (this.state.firstImg - 6 >= 0) {
      img = <img src="/img/other/left-arrow.png" height="20" />;
    }
    console.log("left ",img)
    return img;
  }

  checkLastMenuSet() {
    let img = "";
    if (this.state.firstImg <= this.state.menus.length && 
      this.state.secondImg <= this.state.menus.length && 
      this.state.thirdImg <= this.state.menus.length && 
      this.state.forthImg <= this.state.menus.length && 
      this.state.fifthImg <= this.state.menus.length && 
      this.state.sixthImg <= this.state.menus.length && this.state.menus.length != 0) {
      img = <img className="imgbutton" src="/img/other/right-arrow.png" height="20" />
    }
    console.log("right ",img)
    return img;
  }

  render() {
    const {
      isLoaded,
      menus,
      firstImg,
      secondImg,
      thirdImg,
      forthImg,
      fifthImg,
      sixthImg
    } = this.state;
    if (!isLoaded) {
      return <div class="loader setposition" />;
    }
    return (
      <div className="menuzone">

        <div className="mergerow-left">
          <div onClick={this.leftClick}>{this.checkFirstMenuSet()}</div>
        </div>

        <Row className="firstrow">
          {menus[firstImg] && (
            <CardMenu
              name={menus[firstImg].menu_name}
              picture={menus[firstImg].img_url}
              calories={menus[firstImg].calories}
              id = {menus[firstImg]._id}
            />
          )}

          {menus[secondImg] && (
            <CardMenu
              name={menus[secondImg].menu_name}
              picture={menus[secondImg].img_url}
              calories={menus[secondImg].calories}
              id = {menus[secondImg]._id}
            />
          )}

          {menus[thirdImg] && (
            <CardMenu
              name={menus[thirdImg].menu_name}
              picture={menus[thirdImg].img_url}
              calories={menus[thirdImg].calories}
              id = {menus[thirdImg]._id}
            />
          )}
        </Row>

        <div className="mergerow-right">
          <div onClick={this.rightClick.bind(this)}>
            {this.checkLastMenuSet()}
          </div>
        </div>

        <Row className="secondrow">
          {menus[forthImg] && (
            <CardMenu
              name={menus[forthImg].menu_name}
              picture={menus[forthImg].img_url}
              calories={menus[forthImg].calories}
              id = {menus[forthImg]._id}
            />
          )}

          {menus[fifthImg] && (
            <CardMenu
              name={menus[fifthImg].menu_name}
              picture={menus[fifthImg].img_url}
              calories={menus[fifthImg].calories}
              id = {menus[fifthImg]._id}
            />
          )}

          {menus[sixthImg] && (
            <CardMenu
              name={menus[sixthImg].menu_name}
              picture={menus[sixthImg].img_url}
              calories={menus[sixthImg].calories}
              id = {menus[sixthImg]._id}
            />
          )}
        </Row>
        <div />
      </div>
    );
  }
}

export default Menu;
