
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { useAudioPlayer, createAudioPlayer } from "expo-audio";

export default function App() {
const [screen, setScreen] = useState<
  "works" | "scenes" | "pads" | "padEditor"
>("works");

const [selectedScene, setSelectedScene] = useState(1);
const [isEditing, setIsEditing] = useState(false);

const [selectedPad, setSelectedPad] = useState<number | null>(null);
const [padName, setPadName] = useState("");
const [padColor, setPadColor] = useState("#777777");
const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
const [selectedAudioUri, setSelectedAudioUri] = useState<string | null>(null);
const audioPlayer = useAudioPlayer(null);
const padPlayers = useRef<
  Record<string, ReturnType<typeof createAudioPlayer>>
>({});
const [padNames, setPadNames] = useState<Record<string, string>>({});
const [padColors, setPadColors] = useState<Record<string, string>>({});
const [padAudios, setPadAudios] = useState<
  Record<string, { name: string; uri: string }>
>({});

const openPadEditor = (padNumber: number) => {
  const key = `${selectedScene}-${padNumber}`;

  setSelectedPad(padNumber);
  setPadName(padNames[key] || "");
  setPadColor(padColors[key] || "#777777");

  setSelectedAudio(padAudios[key]?.name || null);
  setSelectedAudioUri(padAudios[key]?.uri || null);

  setScreen("padEditor");
};

const pickAudio = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];

      setSelectedAudio(file.name);
      setSelectedAudioUri(file.uri);
    }
  } catch (error) {
    console.log("Error al seleccionar audio:", error);
  }
};
const testAudio = () => {
  if (!selectedAudioUri) {
    alert("Primero seleccioná un archivo de audio.");
    return;
  }

  try {
    audioPlayer.replace(selectedAudioUri);
    audioPlayer.play();
  } catch (error) {
    console.log("Error al reproducir audio:", error);
    alert("No se pudo reproducir el sonido.");
  }
};


const playPad = (padNumber: number) => {
  const key = `${selectedScene}-${padNumber}`;
  const audio = padAudios[key];

  if (!audio) return;

  try {
    const previousPlayer = padPlayers.current[key];

    if (previousPlayer) {
      previousPlayer.pause();
      previousPlayer.remove();
    }

    const player = createAudioPlayer(audio.uri);

    padPlayers.current[key] = player;
    player.play();
  } catch (error) {
    console.log("Error al reproducir pulsador:", error);
  }
};

const stopAllSounds = () => {
  Object.values(padPlayers.current).forEach((player) => {
    try {
      player.pause();
      player.remove();
    } catch (error) {
      console.log("Error al detener sonido:", error);
    }
  });

  padPlayers.current = {};
};

const goBack = () => {
  if (screen === "padEditor") {
    setScreen("pads");
    setIsEditing(true);
  } else if (screen === "pads") {
    stopAllSounds();
    setScreen("scenes");
    setIsEditing(false);
  } else if (screen === "scenes") {
    setScreen("works");
  }
};

const availableColors = [
  "#3677A8", // Azul
  "#47775B", // Verde
  "#B84A4A", // Rojo
  "#D18A35", // Naranja
  "#795578", // Violeta
  "#D19AB5", // Rosa
  "#777777", // Gris
  "#D5B85A", // Amarillo
];

  const scenes = [
    { id: 1, name: "Escena 1", color: "#355C85" },
    { id: 2, name: "Escena 2", color: "#47775B" },
    { id: 3, name: "Escena 3", color: "#795578" },
  ];

 return (
  <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="light" />

      <View style={styles.header}>

{screen !== "works" && (
  <TouchableOpacity
    onPress={goBack}
    style={styles.backButton}
  >
    <Text style={styles.backText}>
      ‹
    </Text>
  </TouchableOpacity>
)}



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
  ) : screen === "padEditor" ? (
 <ScrollView
  style={{ flex: 1 }}
  contentContainerStyle={{ paddingBottom: 50 }}
  keyboardShouldPersistTaps="handled"
>
    <Text style={styles.workLabel}>
      Escena {selectedScene}
    </Text>

    <Text style={styles.sectionTitle}>
      Editar pulsador {selectedPad}
    </Text>

<View
  style={[
    styles.editorPreview,
    { backgroundColor: padColor },
  ]}
>
  <Text style={styles.padText}>
    {padName.trim() || selectedPad}
  </Text>
</View>

    <Text style={styles.editorDescription}>
      Aquí configuraremos el nombre, color,
      sonido y volumen de este pulsador.
    </Text>

<Text style={styles.inputLabel}>
  Nombre del pulsador
</Text>

<TextInput
  style={styles.nameInput}
  value={padName}
  onChangeText={setPadName}
  placeholder="Ej. Timbre"
  placeholderTextColor="#81919D"
  maxLength={30}
/>
<Text style={styles.inputLabel}>
  Color del pulsador
</Text>

<View style={styles.colorGrid}>
  {availableColors.map((color) => (
    <TouchableOpacity
      key={color}
      onPress={() => setPadColor(color)}
      style={[
        styles.colorOption,
        { backgroundColor: color },
        padColor === color && styles.colorSelected,
      ]}
    />
  ))}
</View>
<Text style={styles.inputLabel}>
  Archivo de audio
</Text>

<TouchableOpacity
  style={styles.audioButton}
  onPress={pickAudio}
>
  <Text style={styles.audioButtonText}>
    🎵 Seleccionar audio
  </Text>
</TouchableOpacity>

{selectedAudio && (
  <Text style={styles.audioFileName}>
    Archivo: {selectedAudio}
  </Text>
)}
<TouchableOpacity
  style={styles.testAudioButton}
  onPress={testAudio}
>
  <Text style={styles.testAudioButtonText}>
    ▶ Probar sonido
  </Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.saveButton}
  onPress={() => {
    if (selectedPad === null) return;

    const key = `${selectedScene}-${selectedPad}`;

    setPadNames((previous) => ({
      ...previous,
      [key]: padName.trim(),
    }));

    setPadColors((previous) => ({
      ...previous,
      [key]: padColor,
    }));
    if (selectedAudio && selectedAudioUri) {
  setPadAudios((previous) => ({
    ...previous,
    [key]: {
      name: selectedAudio,
      uri: selectedAudioUri,
    },
  }));
}

    setScreen("pads");
  }}
>
  <Text style={styles.saveButtonText}>Guardar</Text>
</TouchableOpacity>

</ScrollView>
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
    {
      backgroundColor:
        padColors[`${selectedScene}-${index + 1}`] || "#777777",
    },
    isEditing && styles.padEditing,
  ]}

onPress={() => {
  if (isEditing) {
    openPadEditor(index + 1);
  } else {
    playPad(index + 1);
  }
}}

    >
      {isEditing && (
        <Text style={styles.editIndicator}>✎</Text>
      )}

<Text style={styles.padText}>
  {padNames[`${selectedScene}-${index + 1}`] || index + 1}
</Text>
    </TouchableOpacity>
  ))}
  
{!isEditing && (
  <TouchableOpacity
    style={styles.stopButton}
    onPress={stopAllSounds}
  >
    <Text style={styles.stopButtonText}>
      ⏹ STOP GENERAL
    </Text>
  </TouchableOpacity>
)}

</View>


    <Text style={styles.volumeLabel}>
      Volumen general: 100%
    </Text>

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
  backgroundColor: "#B84A4A",
  paddingVertical: 18,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 25,
  marginHorizontal: 15,
},
stopButtonText: {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "bold",
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
editorPreview: {
  width: 120,
  height: 120,
  backgroundColor: "#777777",
  borderWidth: 2,
  borderColor: "#555555",
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  marginBottom: 25,
},
editorDescription: {
  color: "#AAB8C2",
  fontSize: 16,
  textAlign: "center",
  lineHeight: 24,
},

inputLabel: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "600",
  marginTop: 25,
  marginBottom: 10,
},
nameInput: {
  backgroundColor: "#263642",
  color: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#4C6578",
  borderRadius: 10,
  paddingHorizontal: 15,
  paddingVertical: 14,
  fontSize: 16,
},
saveButton: {
  backgroundColor: "#3677A8",
  paddingVertical: 15,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 25,
},
saveButtonText: {
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: "bold",
},
colorGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 10,
},
colorOption: {
  width: 48,
  height: 48,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: "#FFFFFF33",
},
colorSelected: {
  borderColor: "#FFFFFF",
  borderWidth: 4,
},
audioButton: {
  backgroundColor: "#263642",
  paddingVertical: 16,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#4C6578",
  alignItems: "center",
  marginTop: 10,
},
audioButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "600",
},
audioFileName: {
  color: "#66D9A3",
  fontSize: 14,
  marginTop: 12,
},
testAudioButton: {
  backgroundColor: "#47775B",
  paddingVertical: 15,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 15,
},
testAudioButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "bold",
},
});
