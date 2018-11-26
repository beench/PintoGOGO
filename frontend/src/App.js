import React, { Component } from "react";
import "./css/App.css";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./util/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import store from "./store";
//payment
import {Elements, StripeProvider} from 'react-stripe-elements';

//---------------don--------------------------------
import Addmenu from "./component/add/addmenu";
import Addsnack from "./component/add/addsnack";
import Snack from "./component/snack/snack.js";
import CheckoutForm from './component/checkout/CheckoutForm.js';
import UnderConstruct from "./component/underconstruct/";
//---------------name-------------------------------
import Navbar from "./component/navbar/navbar";
import Carousel from "./component/carousel/carousel";
import Choice from "./component/choice/choice";
import Recommend from "./component/recommend/recommend";
import Payment from "./component/payment/payment";
//---------------boo---------------------------------
import Menu from "./component/menu/menu.js";
import Cart from "./component/cart/cart.js";
import MenuDetail from "./component/detail/menudetail.js";
import SnackDetail from "./component/detail/snackdetail.js";
import EditMenuDetail from "./component/editmenudetail/editmenudetail.js";
import Payment2 from "./component/payment2/payment2.js"
//---------------been-----------------------------------
import Register from "./component/register/register.js";
import Package from "./component/package/package.js";
import PackageManage from "./component/packagemanage/packagemanage.js";
import Profile from "./component/profile/profile";
import Footer from "./component/footer/footer.js";
import Pack3days from "./component/package/3days/pack3DaysDetail.js"
import Pack5days from "./component/package/5days/pack5DaysDetail.js"
import Pack7days from "./component/package/7days/pack7DaysDetail.js"
import MyPackage from "./component/mypackage/mypackage.js"
import EditProfile from "./component/editprofile/editprofile.js"
//---------------pat------------------------------------
import Login from "./component/login/mainlogin/login";

const Home = () => {
  return [<Carousel />, <Recommend />, <Choice />];
};

const PaymentMethod = () => {
  return (
    <StripeProvider apiKey="pk_test_os3uf16y5tFa5WVqnqNPNaJk">
      <div className="example">
        <h1>React Stripe Elements Example</h1>
        <Elements>
          <CheckoutForm />
        </Elements>
      </div>
    </StripeProvider>
  )
}

//Check for token
if (localStorage.jwtToken) {
  //Set auth token header  auth
  setAuthToken(localStorage.jwtToken);
  const decode = jwt_decode(localStorage.jwtToken);
  // set user and isAuth
  store.dispatch(setCurrentUser(decode));

  //check for expired token
  const currentTime = Date.now() / 1000;
  if (decode.exp < currentTime) {
    //logout user
    store.dispatch(logoutUser());
    //TODO: Clear current profile
    // Clear current profile

    //redirect
    window.location.href = "/login";
  }
}

{
  /*-------------Add path of page---------------*/
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
              <Switch>
                <Route exact path="/" component={Home} />
                {/* <Route path="/demomenu" component={DemoMenu} /> */}
                <Route path ="/payment" component ={PaymentMethod}/>
                <Route path="/add/menu" component={Addmenu} />
                <Route path="/add/snack" component={Addsnack} />
                <Route path="/show/menu" component={Menu} />
                <Route path="/show/snack" component={Snack} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/package" component={Package} />
                <Route path="/packagemanage" component={PackageManage} />
                <Route path="/profile" component={Profile} />
                <Route path="/editprofile" component={EditProfile} />
                <Route path="/cart" component={Cart}/>
                <Route path="/payment2" component={Payment2} />
                <Route path="/menudetail" component={MenuDetail} />
                <Route path="/3days" component={Pack3days} />
                <Route path="/5days" component={Pack5days} />
                <Route path="/7days" component={Pack7days} />
                <Route path="/mypackage" component={MyPackage} />
                <Route path="/snackdetail" component={SnackDetail} />
                <Route path="/editmenudetail" component={EditMenuDetail} />
                <Route paht="/bill" component={Payment}/>
                <Route path="*" component={UnderConstruct}/>
              </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
