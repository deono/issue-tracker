class IssueFilter extends React.Component {
  render() {
    return <div>IssueFilter</div>;
  }
}

// array of issues
const initialIssues = [
  {
    id: 1,
    status: "New",
    owner: "Ravan",
    effort: 5,
    created: new Date("2018-08-15"),
    due: undefined,
    title: "Error in console when clicking Add"
  },
  {
    id: 2,
    status: "Assigned",
    owner: "Eddie",
    effort: 14,
    created: new Date("2018-08-16"),
    due: new Date("2018-08-30"),
    title: "Missing bottom border on panel"
  }
];

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
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      this.setState({ issues: initialIssues });
    }, 500);

    this.createIssue = this.createIssue.bind(this);
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
