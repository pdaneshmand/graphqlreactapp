import React, { Component } from "react";
import { graphql } from "react-apollo";
import { compose } from "recompose";
import { getAuthorsQuery, addBookMutation } from "../queries/queries";
import { getBooksQuery } from "../queries/queries";

class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      genre: "",
      authorId: ""
    };
  }
  clearForm() {
    this.setState({ name: "", genre: "", authorId: "" });
  }
  displayAuthors() {
    let { getAuthorsQuery } = this.props;
    if (getAuthorsQuery.loading) {
      return <option disabled>Loading Authors ...</option>;
    } else {
      return getAuthorsQuery.authors.map(author => {
        return (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        );
      });
    }
  }
  submitForm(e) {
    const { addBookMutation } = this.props;
    const { name, genre, authorId } = this.state;
    e.preventDefault();
    addBookMutation({
      variables: {
        name: name,
        genre: genre,
        authorId: authorId
      },
      refetchQueries: [{ query: getBooksQuery }]
    });
    this.clearForm();
  }
  render() {
    return (
      <form id="add-book" onSubmit={this.submitForm.bind(this)}>
        <div className="field">
          <label>Book name:</label>
          <input
            type="text"
            onChange={e => this.setState({ name: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Genre:</label>
          <input
            type="text"
            onChange={e => this.setState({ genre: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Author:</label>
          <select onChange={e => this.setState({ authorId: e.target.value })}>
            <option>Select author</option>
            {this.displayAuthors()}
          </select>
        </div>
        <button>+</button>
      </form>
    );
  }
}

export default compose(
  graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
  graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);
