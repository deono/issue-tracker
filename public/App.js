"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var dateRegex = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d"); // convert date strings to native JS Date types

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) {
    // if the value is a date string
    return new Date(value); // convert to native JS Date type
  }

  return value;
}

var IssueFilter =
/*#__PURE__*/
function (_React$Component) {
  _inherits(IssueFilter, _React$Component);

  function IssueFilter() {
    _classCallCheck(this, IssueFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(IssueFilter).apply(this, arguments));
  }

  _createClass(IssueFilter, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, "IssueFilter");
    }
  }]);

  return IssueFilter;
}(React.Component);

function IssueTable(props) {
  var issueRows = props.issues.map(function (issue) {
    return React.createElement(IssueRow, {
      key: issue.id,
      issue: issue
    });
  });
  return React.createElement("div", null, React.createElement("table", {
    className: "bordered-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "ID"), React.createElement("th", null, "Status"), React.createElement("th", null, "Owner"), React.createElement("th", null, "Created"), React.createElement("th", null, "Effort"), React.createElement("th", null, "Due date"), React.createElement("th", null, "Title"))), React.createElement("tbody", null, issueRows)));
}

function IssueRow(props) {
  var _props$issue = props.issue,
      id = _props$issue.id,
      status = _props$issue.status,
      owner = _props$issue.owner,
      created = _props$issue.created,
      effort = _props$issue.effort,
      due = _props$issue.due,
      title = _props$issue.title;
  return React.createElement("tr", null, React.createElement("td", null, id), React.createElement("td", null, status), React.createElement("td", null, owner), React.createElement("td", null, created.toDateString()), React.createElement("td", null, effort), React.createElement("td", null, due ? due.toDateString() : ""), React.createElement("td", null, title));
}

var IssueAdd =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(IssueAdd, _React$Component2);

  function IssueAdd(props) {
    var _this;

    _classCallCheck(this, IssueAdd);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IssueAdd).call(this, props));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(IssueAdd, [{
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      var form = document.forms.issueAdd;
      var issue = {
        owner: form.owner.value,
        title: form.title.value,
        // status: "New",
        // set the due date 10 days from the current date
        due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
      };
      this.props.createIssue(issue);
      form.owner.value = "";
      form.title.value = "";
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", null, React.createElement("form", {
        name: "issueAdd",
        onSubmit: this.handleSubmit
      }, React.createElement("input", {
        type: "text",
        name: "owner",
        placeholder: "Owner"
      }), React.createElement("input", {
        type: "text",
        name: "title",
        placeholder: "Title"
      }), React.createElement("button", null, "Add")));
    }
  }]);

  return IssueAdd;
}(React.Component);

var IssueList =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(IssueList, _React$Component3);

  function IssueList() {
    var _this2;

    _classCallCheck(this, IssueList);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(IssueList).call(this));
    _this2.state = {
      issues: []
    };
    _this2.createIssue = _this2.createIssue.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(IssueList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadData();
    } // get a list of issues from the issues DB

  }, {
    key: "loadData",
    value: function loadData() {
      var query, response, body, result;
      return regeneratorRuntime.async(function loadData$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // construct GraphQL query
              query = "query {\n      issueList {\n        id title status owner created effort due\n      }\n    }"; // send the query string as the value for the query property within a JSON
              // as part of the body to the fetch requst

              _context.next = 3;
              return regeneratorRuntime.awrap(fetch("/graphql", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  query: query
                })
              }));

            case 3:
              response = _context.sent;
              _context.next = 6;
              return regeneratorRuntime.awrap(response.text());

            case 6:
              body = _context.sent;
              // the jsonDateReviver parses date string to native JS Date types
              result = JSON.parse(body, jsonDateReviver); // set the state with the result data

              this.setState({
                issues: result.data.issueList
              });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    } // createIssue(issue) {
    //   issue.id = this.state.issues.length + 1;
    //   issue.created = new Date();
    //   const newIssueList = this.state.issues.slice();
    //   newIssueList.push(issue);
    //   this.setState({ issues: newIssueList });
    // }
    // Add a new issue to the issues database

  }, {
    key: "createIssue",
    value: function createIssue(issue) {
      var query, response;
      return regeneratorRuntime.async(function createIssue$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // GraphQl query
              query = "mutation {\n      issueAdd(issue:{\n        title: \"".concat(issue.title, "\",\n        owner: \"").concat(issue.owner, "\",\n        due: \"").concat(issue.due.toISOString(), "\"\n      }) {\n        id\n      }\n    }"); // use the query to execute fetch asyncronously

              _context2.next = 3;
              return regeneratorRuntime.awrap(fetch("/graphql", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  query: query
                })
              }));

            case 3:
              response = _context2.sent;
              // refresh the list of issues
              this.loadData();

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(React.Fragment, null, React.createElement("h1", null, "Issue Tracker"), React.createElement(IssueFilter, null), React.createElement("hr", null), React.createElement(IssueTable, {
        issues: this.state.issues
      }), React.createElement("hr", null), React.createElement(IssueAdd, {
        createIssue: this.createIssue
      }));
    }
  }]);

  return IssueList;
}(React.Component);

var element = React.createElement(IssueList, null);
ReactDOM.render(element, document.getElementById("contents"));