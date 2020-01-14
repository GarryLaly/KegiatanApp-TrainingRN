import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import styled from "styled-components";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import MapView, { Marker } from 'react-native-maps';

const Container = styled.View`
  background-color: #eee;
  flex: 1;
  padding: 20px;
`;
const MapContainer = styled.View`
  height: 200px;
  overflow: hidden;
`;

const EventItem = styled.TouchableOpacity`
  background-color: white;
  flex-direction: row;
  margin-bottom: 10px;
`;
const EventItemDate = styled.View`
  background-color: #999;
  padding: 20px;
`;
const EventItemContent = styled.View`
  padding: 20px;
  flex: 1;
`;
const EventItemDateDay = styled.Text`
  font-size: 24px;
`;
const EventItemDateMonth = styled.Text`
  font-size: 18px;
`;
const EventItemDateTime = styled.Text`
  font-size: 16px;
`;
const EventItemContentTitle = styled.Text`
  font-size: 20px;
`;
const EventItemContentLocation = styled.Text`
  color: #666;
  font-size: 14px;
`;

class EventList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      markers: [],
    };
    
    this.mapRef = null;
  }

  async getEvents() {
    try {
      const response = await axios.get('events');
      const eventData = response.data.map((item, index) => ({
        ...item,
        location_lat: parseFloat(item.location_lat),
        location_long: parseFloat(item.location_long),
      }));

      this.setState({ events: eventData });

      this.mapRef.fitToCoordinates(eventData.map((item, index) => ({latitude: item.location_lat, longitude: item.location_long})), {
        edgePadding: { top: 0, right: 0, bottom: 0, left: 0 },
        animated: true,
      })
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.getEvents();
  }

  render() {
    return (
      <Container>
        <MapContainer>
          <MapView
            ref={(ref) => { this.mapRef = ref }}
            style={{...StyleSheet.absoluteFillObject}}
            initialRegion={{
              latitude: -7.2891782,
              longitude: 112.6756434,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {this.state.events.map((item, index) => (
              <Marker
                coordinate={{latitude: item.location_lat, longitude: item.location_long}}
                title={item.title}
                description={item.location_name}
              />
            ))}
          </MapView>
        </MapContainer>
        {this.state.events.map((item, index) => (
          <EventItem key={index} onPress={() => this.props.navigation.navigate("EventDetail", {
              eventID: item.id
            })}>
            <EventItemDate>
              <EventItemDateDay>{moment(item.date).format("DD")}</EventItemDateDay>
              <EventItemDateMonth>{moment(item.date).format("MMM")}</EventItemDateMonth>
              <EventItemDateTime>{item.hour}</EventItemDateTime>
            </EventItemDate>
            <EventItemContent>
              <EventItemContentTitle>{item.title}</EventItemContentTitle>
              <EventItemContentLocation>{item.location_name}</EventItemContentLocation>
              <EventItemContentLocation>{moment(item.date).fromNow()}</EventItemContentLocation>
            </EventItemContent>
          </EventItem>
        ))}
        <Text>Map</Text>
      </Container>
    );
  }
}

export default EventList;
