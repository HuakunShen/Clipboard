import React, { useEffect } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./stylesheets/App.scss";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import NotFound404 from "./components/NotFound404";
import ClipboardPage from "./components/Clipboard/ClipboardPage";
import ClipboardIntro from "./components/Clipboard/ClipboardIntro";
import ShareableClipboard from "./components/Clipboard/ShareableClipboard";
// import '@fortawesome/fontawesome-free/css/all.css';
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./lib/redux_helper";

const App = (props) => {
  useEffect(() => {
    props.loadAuth();
    // eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ClipboardIntro} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/clipboard" component={ClipboardPage} />
        <Route exact path="/clipboard-intro" component={ClipboardIntro} />
        <Route exact path="/clipboard/:id" component={ShareableClipboard} />
        <Route exact path="/*" component={NotFound404} />
      </Switch>
    </BrowserRouter>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
