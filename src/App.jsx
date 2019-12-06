const dateRegex = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d");

// convert date strings to native JS Date types
function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) {
    // if the value is a date string
    return new Date(value); // convert to native JS Date type
  }
  return value;
}

class IssueFilter extends React.Component {
  render() {
    return <div>IssueFilter</div>;
  }
}

function IssueTable(props) {
  const issueRows = props.issues.map(issue => (
    <IssueRow key={issue.id} issue={issue} />
  ));
  return (
    <div>
      <table className="bordered-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Created</th>
            <th>Effort</th>
            <th>Due date</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>{issueRows}</tbody>
      </table>
    </div>
  );
}

function IssueRow(props) {
  const { id, status, owner, created, effort, due, title } = props.issue;

  return (
    <tr>
      <td>{id}</td>
      <td>{status}</td>
      <td>{owner}</td>
      <td>{created.toDateString()}</td>
      <td>{effort}</td>
      <td>{due ? due.toDateString() : ""}</td>
      <td>{title}</td>
    </tr>
  );
}

class IssueAdd extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      status: "New"
    };
    this.props.createIssue(issue);
    form.owner.value = "";
    form.title.value = "";
  }

  render() {
    return (
      <div>
        <form name="issueAdd" onSubmit={this.handleSubmit}>
          <input type="text" name="owner" placeholder="Owner" />
          <input type="text" name="title" placeholder="Title" />
          <button>Add</button>
        </form>
      </div>
    );
  }
}

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    // construct GraphQL query
    const query = `query {
      issueList {
        id title status owner created effort due
      }
    }`;
    // send the query string as the value for the query property within a JSON
    // as part of the body to the fetch requst
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    // convert the JSON data in the response to a JavaScript object and store as the result
    const body = await response.text();
    // the jsonDateReviver parses date string to native JS Date types
    const result = JSON.parse(body, jsonDateReviver);
    // set the state with the result data
    this.setState({ issues: result.data.issueList });
  }

  createIssue(issue) {
    issue.id = this.state.issues.length + 1;
    issue.created = new Date();
    const newIssueList = this.state.issues.slice();
    newIssueList.push(issue);
    this.setState({ issues: newIssueList });
  }

  render() {
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </React.Fragment>
    );
  }
}

const element = <IssueList />;

ReactDOM.render(element, document.getElementById("contents"));
