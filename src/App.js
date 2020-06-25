import React, { useState, useEffect } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  // Actual state of the list
  const [ repolist, setRepolist ] = useState([]);

  // Fetch and save repositories list from API 
  useEffect( () => {
    api.get('/repositories')
    .then( response => {  setRepolist(response.data)  } )
  }, []);  

  async function handleLikeRepository(id) {
  // Implement "Like Repository" functionality
    const response = await api.post(`/repositories/${id}/like`);
    const likedRepo = repolist.findIndex( repo => repo.id === response.data.id);
    const newRepolist = [...repolist];
    newRepolist[likedRepo].likes = response.data.likes;    
    setRepolist(newRepolist);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>

        <FlatList 
          data={repolist}
          keyExtractor={ repo => repo.id }
          renderItem={( repo ) => { 
            return (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repo.item.title}</Text>

              <View style={styles.techsContainer}>
                { repo.item.techs.map( tech => {
                  return (
                    <Text key={`repository-${repo.index}-${tech}`} style={styles.tech}>
                      {tech}
                    </Text>
                  )}) 
                }
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repo.item.id}`}
                >
                  {repo.item.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repo.item.id)}
                testID={`like-button-${repo.item.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
            )}}
        />
                      
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
