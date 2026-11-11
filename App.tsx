
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
const [screen, setScreen] = useState<
  "works" | "scenes" | "pads"
>("works");

const [selectedScene, setSelectedScene] = useState(1);
const [isEditing, setIsEditing] = useState(false);

const goBack = () => {
  if (screen === "pads") {
    setScreen("scenes");
  } else if (screen === "scenes") {
    setScreen("works");
  }
};

  const scenes = [
    { id: 1, name: "Escena 1", color: "#355C85" },
    { id: 2, name: "Escena 2", color: "#47775B" },
    { id: 3, name: "Escena 3", color: "#795578" },
  ];

 return (
  <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setScreen("works")}
          disabled={screen === "works"}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            {screen === "scenes" ? "‹" : ""}
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          🎭 CONSOLA TEATRAL
        </Text>

       <TouchableOpacity
  onPress={() => {
    if (screen === "pads") {
      setIsEditing(!isEditing);
    }
  }}
>
  <Text style={styles.editText}>
    {isEditing && screen === "pads" ? "Finalizar" : "Editar"}
  </Text>
</TouchableOpacity>
      </View>

      <View style={styles.content}>
        
{screen === "works" ? (
  <>
    <Text style={styles.sectionTitle}>Mis obras</Text>

    <TouchableOpacity
      style={styles.workButton}
      onPress={() => setScreen("scenes")}
    >
      <View>
        <Text style={styles.itemTitle}>Mi primera obra</Text>
        <Text style={styles.itemSubtitle}>3 escenas</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.addButton}>
      <Text style={styles.addText}>+ Nueva obra</Text>
    </TouchableOpacity>
  </>
) : screen === "scenes" ? (
  <>
    <Text style={styles.workLabel}>Mi primera obra</Text>
    <Text style={styles.sectionTitle}>Escenas</Text>

    {scenes.map((scene) => (
      <TouchableOpacity
        key={scene.id}
        style={[
          styles.sceneButton,
          { backgroundColor: scene.color },
        ]}
        onPress={() => {
          setSelectedScene(scene.id);
          setScreen("pads");
        }}
      >
        <Text style={styles.itemTitle}>{scene.name}</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    ))}
  </>
) : (
  <>
    <Text style={styles.workLabel}>Mi primera obra</Text>

    <Text style={styles.sectionTitle}>
      Escena {selectedScene}
    </Text>


<View style={styles.padGrid}>
  {Array.from({ length: 9 }, (_, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.pad,
        isEditing && styles.padEditing,
      ]}
      onPress={() => {
        if (isEditing) {
          alert(`Editar pulsador ${index + 1}`);
        }
      }}
    >
      {isEditing && (
        <Text style={styles.editIndicator}>✎</Text>
      )}

      <Text style={styles.padText}>
        {index + 1}
      </Text>
    </TouchableOpacity>
  ))}
</View>


    <Text style={styles.volumeLabel}>
      Volumen general: 100%
    </Text>

    <TouchableOpacity style={styles.stopButton}>
      <Text style={styles.stopText}>
        ■ STOP GENERAL
      </Text>
    </TouchableOpacity>
  </>
)}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101820",
  },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#33424E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 25,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 32,
  },
  headerTitle: {
    color: "#61B8FF",
    fontSize: 17,
    fontWeight: "bold",
  },
  editText: {
    color: "#09c259",
    fontSize: 16,
    fontWeight: "600",
    padding:20,
    backgroundColor:"#6e6d6d",
    borderRadius:10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
  },
  workLabel: {
    color: "#AAB8C2",
    fontSize: 14,
    marginBottom: 8,
  },
  workButton: {
    backgroundColor: "#355C85",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sceneButton: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  itemSubtitle: {
    color: "#DFE9F2",
    fontSize: 13,
    marginTop: 5,
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 32,
  },
  addButton: {
    borderWidth: 1,
    borderColor: "#4C6578",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  addText: {
    color: "#AAB8C2",
    fontSize: 16,
    fontWeight: "600",
  },
  
padGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: 30,
},
pad: {
  width: "33%",
  aspectRatio: 1,
  backgroundColor: "#777777",
  borderWidth: 2,
  borderColor: "#555555",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 18,
},
padText: {
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: "bold",
},
volumeLabel: {
  color: "#AAB8C2",
  fontSize: 16,
  marginBottom: 20,
},
stopButton: {
  backgroundColor: "#B83B3B",
  padding: 20,
  borderRadius: 12,
  alignItems: "center",
},
stopText: {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "bold",
},
padEditing: {
  borderColor: "#61B8FF",
  borderWidth: 2,
},
editIndicator: {
  position: "absolute",
  top: 5,
  right: 7,
  color: "#FFFFFF",
  fontSize: 14,
},
});
