import React, { Component } from "react";
import { Text } from "react-native";
import styled from "styled-components";
import axios from "axios";

const Container = styled.View`
  background-color: #eee;
  flex: 1;
  padding: 20px;
`;

class EventDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detail: {},
    };
  }

  async getDetail() {
    try {
      const response = await axios.get('event/'+this.props.navigation.state.params.eventID);

      this.setState({ detail: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.getDetail();
  }

  render() {
    return (
      <Container>
        <Text>{this.state.detail.title}</Text>
      </Container>
    );
  }
}

export default EventDetail;
