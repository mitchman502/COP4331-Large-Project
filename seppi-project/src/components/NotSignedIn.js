import React from 'react';
import 'typeface-roboto';
import {Link} from "react-router-dom"
import { useCookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal'
import AccountButton from './AccountButton';

const NotSignedIn =() => {
  const [cookies, setCookie] = useCookies(['name', 'email', 'idToken']);
  const [show, setList] = React.useState(false);
  const [showAccount, setShowAccount] = React.useState(false);
  const [accountModalPath, setAccountModalPath] = React.useState('');
  const [changeAccountInfoResult, setChangeAccountInfoResult] = React.useState('');
  const handleCloseList = () => setList(false);
  const handleShowList = () => setList(true);
  const handleShowAccount = () => setShowAccount(!showAccount);
  document.body.style.height = "100vh";

  const app_name = 'seppi'
  const buildPath = (route) => {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else {
      return 'http://localhost:5000/' + route;
    }
  }

  const handleBackButton = () => {
    setAccountModalPath("");
  }

  const renderAccountModalTitle = () => {
    if (accountModalPath === "Change Account Information") {
      return (
        <div class="accountModalTitle">
              <div class="modal-account-top-bar">
                <button onClick={handleBackButton} class="btn">
                  <img src={require('../images/left-arrow.png')}/>
                </button>
              </div>
              <span class="modal-title-text">Account Information</span>
              <span class="modal-subtitle-text">Update Account Information</span>
        </div>
      );
    }
    else if (accountModalPath === "") {
      return (
        <div class="accountModalTitle">
          <div class="accountModalTitle">
            <span id="helloText" class="modal-title-text">
              Hello, {cookies.name}!
            </span>
            <span id="emailText" class="modal-subtitle-text">
              {cookies.email}
            </span>
          </div>
          <span class="modal-subtitle-text">Navigate To</span>
        </div>
      );
    }
  };

  const changeAccountInfo = async event => {
    event.preventDefault();

    let name = document.getElementById('inputAccountName').value

    const response = await fetch(buildPath('changeDisplayName'), {
      method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
        idToken: cookies.idToken,
        displayName: name
			})
    }).catch(error => console.error(error));

    let status = await response.status;
    let json = JSON.parse(await response.text());

    if (status === 200) {
      setCookie('name', name, {path: '/'});
    }
    else {
      setChangeAccountInfoResult('Failed to change account info.');
      return;
    }

    setChangeAccountInfoResult('Successfully changed account information.');
  }

  const signOut = async event => {
    event.preventDefault();

    const response = await fetch(buildPath('signout'), {
      method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
    }).catch(error => console.error(error));

    let status = await response.status;

    if (status !== 200) {
      console.log("Failed to sign out");
      return;
    }

    window.location.href = '/LoginPage';
  };

  const renderAccountModalBody = () => {
    if (accountModalPath === "") {
      return (
        <div>
          <AccountButton
            title="Change Account Information"
            onClick={() => setAccountModalPath("Change Account Information")}
          />
          <AccountButton
            title="Search Recipes"
            onClick={() => window.location.href='/SearchResult'}
          />
          <AccountButton
            title="Favorite Recipes"
            onClick={() => window.location.href='/NotSignedIn'}
          />
          <AccountButton
            title="Sign Out"
            onClick={signOut}
          />
        </div>
      );
    }
    else if (accountModalPath === "Change Account Information") {
      return (
        <div class="accountModalTitle">
          <form onSubmit={changeAccountInfo} className="loginsForm">
            <input 
              type="text"
              placeholder="Display Name"
              name="inputAccountName" 
              id="inputAccountName"
              className="form-control account-input"
              required
            />
           <div id="accountInfoResult">
             {changeAccountInfoResult}
           </div>

           <button id = "editAccountButton" type="submit" className="btn btn-primary">
              Edit Account Info
            </button>
          </form>
        </div>
      );
    }
  };

  return(
    <div style={{margin: "0 auto", height: "100vh"}}>
        <div style={{width: "100%", height: "100px", backgroundColor: "#FA730B"}}>
          <div className="row" style={{width: "100%"}}>
            <div style={{width: "25%", height: "100px", color: "white", paddingTop: "5px", fontSize: "60px", fontWeight: "bold"}}>
              Seppi
            </div>
            <div style ={{width: "50%", height: "100px",paddingTop: "25px", textAlign: "center"}}>
              <form>
                <input id="resultSearch" type="text" placeholder="Search by recipe, ingredient, dish..." />
                <span className="searchImage" style={{borderRadius: "1px", width: "4%", backgroundSize: "cover", height: "50px",color: "white", position: "absolute", backgroundColor: "orange", padding: '2px'}}>
                  <i className="fa fa-search" style={{paddingTop: "8px", fontSize: "30px"}}></i>
                </span>
              </form>
            </div>
            <div style={{width: "25%", height: "100px",paddingTop: "5px", textAlign: "center"}}>
              <button id="FavPageButton" onClick={() => console.log("Hello")}>
                <div id = "FavImage"></div>
                Favorites
              </button>
              <button onClick={handleShowAccount} id="AccountSettings">
                <div id = "AccountImage"></div>
                Account
              </button>
              <button id="List">
                <div id="ListImage"></div>
                Lists
              </button>
            </div>
          </div>
        </div>
        <br/>
        <div id="FavHeader" className="row">
            <div id="HeartImage"></div>
            <div style={{color: "black", width: "50%", textAlign: "left", fontWeight: "bold", fontSize: "30px"}}>Favorites</div>
        </div>
        <br/>
        <div id="FavBody">
            <div id="biggerHeartImage"></div>
            <h1>You are just a step away from your favorite recipes!</h1>
            You need to be signed on into Seppi to view your favorites. Keep track of the recipes you love or want to view later.
            <br/>
            <br/>
            <div style={{fontWeight: "bold"}}>
                <Link to="/Login" style={{color: "#FA730B"}}> Sign in</Link>{" "}
                to view your Favorites
            </div>
        </div>

        <Modal show={showAccount} onHide={handleShowAccount}>
          <Modal.Header className="justify-content-center">
            <Modal.Title>
              {renderAccountModalTitle()}
            </Modal.Title>

          </Modal.Header> 
          <Modal.Body>
            {renderAccountModalBody()}
          </Modal.Body>
      </Modal>
    </div>
  );
};

export default NotSignedIn;