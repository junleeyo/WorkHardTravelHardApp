import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";
const STORAGE_TAB_KEY = "@tab";

export default function App() {
  const [complete, setComplete] = useState(false);
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos();
    loadTab();
  }, []);
  const onChangeText = (payload) => setText(payload);

  /* tab S */
  const travel = () => {
    setWorking(false); 
    saveTab(false);
  }
  const work = () => { 
    setWorking(true);
    saveTab(true);
  }
  const loadTab = async () => {
    const s = await AsyncStorage.getItem(STORAGE_TAB_KEY);
    s ? setWorking(JSON.parse(s).Working) : null;    
  }; 
  const saveTab = async (toSave) => {
    const newWorking = {
      "Working": toSave
    };
    await AsyncStorage.setItem(STORAGE_TAB_KEY, JSON.stringify(newWorking));
  };
  /* tab E */  

  /* ToDo S */
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    s ? setToDos(JSON.parse(s)) : null;    
  }; 
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const deleteToDo = (key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Delete To Do?");
      if(ok){
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    }else{
      Alert.alert("Delete To Do", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "I'm Sure",
          style: "destructive",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(newToDos);
          },
        },
      ]); 
    }
  };
  const checkToDo = (key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Complete To Do?");
      if(ok){
        const newToDos = { ...toDos };
        newToDos[key].complete = true;

        setToDos(newToDos);
        saveToDos(newToDos);
      }      
    }else{
      Alert.alert("Complete To Do", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "I'm Sure",
          style: "destructive",
          onPress: () => {
            const newToDos = { ...toDos };
            newToDos[key].complete = true;
  
            setToDos(newToDos);
            saveToDos(newToDos);
          },
        },
      ]);
    }
  };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: {text, working, complete},
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  /* ToDo E */

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ 
              fontSize: 38,
              fontWeight: "600",
              color: working ? "white" : theme.grey 
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "600",
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={
          working ? "What do you have to do?" : "Where do you want to go?"
        }
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) => (
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={
                toDos[key].complete === true ? styles.toDoTextComplete : styles.toDoText                
              }
              >
                {toDos[key].text}
              </Text>
              <View style={styles.toDoBtn}>
                <TouchableOpacity onPress={() => checkToDo(key)}>
                  <Feather name="check" size={18} color={theme.grey} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.grey} />
                </TouchableOpacity>
              </View>
            </View> 
          ) : null
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoBtn: {
    flexDirection: "row",
    flex: 0.2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  toDoTextComplete: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine:"line-through",
  },
});
