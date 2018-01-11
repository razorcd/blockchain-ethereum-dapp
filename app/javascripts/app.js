// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import datastore_artifacts from '../../build/contracts/DataStore.json'

// DataStore is our usable abstraction, which we'll use through the code below.
var DataStore = contract(datastore_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the DataStore abstraction for Use.
    DataStore.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts. Make sure MetaMask Chrome extension is installed.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      // web3.eth.defaultAccount = account;
      // self.buildContracts();

      self.refreshMapCount();
    });
  },

  buildContracts() {
    let contracts = {};
    let meta;

    let {contract_name = ''} = datastore_artifacts;
    meta = contract(datastore_artifacts);
    meta.setProvider(web3.currentProvider);
    meta.defaults({from: web3.eth.coinbase});
    contracts[contract_name] = meta;

    return contracts;
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshMapCount: function() {
    var self = this;

    var ds;
    DataStore.deployed().then(function(instance) {
      ds = instance;
      return ds.GetMapCount.call();
    }).then(function(mapCount) {
      var balance_element = document.getElementById("mapCount");
      balance_element.innerHTML = mapCount.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting map count; see log.");
    });
  },

  addNewData: function() {
    var self = this;

    var id = parseInt(document.getElementById("id").value);
    var name = document.getElementById("name").value;
    var secret = document.getElementById("secret").value;

    this.setStatus("Initiating transaction... (please wait)");

    var ds;
    DataStore.deployed().then(function(instance) {
      ds = instance;
      return ds.AddNewData(id, name, secret, {from: account});  // {from: account}  is needed to perform transactions !!!
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshMapCount();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error adding data; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear, ensure you've configured that source properly. If using MetaMask, see the following link. http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
