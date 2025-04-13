import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";

const Dashboard = () => {
  interface Category {
    id: number;
    name: string;
    icon?: string;
  }

  interface Item {
    id: number;
    name: string;
    address: string;
    phone: number;
    avatar_photo?: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://157.230.109.162:8000/api/categories/"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://157.230.109.162:8000/api/items/"
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchItems()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const renderCategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/categories/${item.id}`)} // Adjust the route as needed
      activeOpacity={0.7}
    >
      <View style={styles.card}>
        {item.icon ? (
          <Image source={{ uri: item.icon }} style={styles.iconImage} />
        ) : null}
        <Text style={styles.cardText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPlaceCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.placeCard}
      onPress={() => router.push(`/items/${item.id}`)} // Navigate to /items/{id}
      activeOpacity={0.7}
    >
      {item.avatar_photo ? (
        <Image
          source={{ uri: item.avatar_photo }}
          style={styles.placeLogo}
        />
      ) : (
        <Text>No Avatar</Text>
      )}
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeAddress}>{item.address}</Text>
        <Text style={styles.placePhone}>{item.phone_numbers}</Text>
      </View>
      <TouchableOpacity
        style={styles.photoPreview}
        onPress={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onPress
          router.push(`/photos/${item.id}`); // Navigate to /photos/gallery/{id}
        }}
        activeOpacity={0.6}
      >
        <Ionicons name="images-outline" size={22} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Static Content */}
      <View>
        {/* Search */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/modals/search")}
            style={{ flex: 1 }}
          >
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#7a7a7a"
                style={styles.icon}
              />
              <View style={styles.input}>
                <Text style={styles.searchtitle}>Search</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/contact")}
                style={styles.helpButton}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={22}
                  color="#007AFF"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories Header */}
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <Text style={styles.showAll}>
              {showAll ? "Show less" : "Show all"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : showAll ? (
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.gridContainer}
          />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(`/categories/${item.id}`)}
              >
                <View style={styles.card}>
                  {item.icon ? (
                    <Image
                      source={{ uri: item.icon }}
                      style={styles.iconImage}
                    />
                  ) : null}
                  <Text style={styles.cardText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Header above scrolling list */}
        <Text style={styles.placesTitle}>Places nearby</Text>
      </View>

      {/* Scrollable Places List */}
      <FlatList
        data={items}
        renderItem={renderPlaceCard}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        style={styles.placesList}
        bounces={true}
        overScrollMode="never"
        decelerationRate="normal"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  placesList: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  showAll: {
    fontSize: 14,
    color: "#007AFF",
  },
  card: {
    width: 113,
    height: 100,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 12,
  },
  iconImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 12,
    color: "#333",
  },
  gridContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: "center",
  },
  placesTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  placeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  placeLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "cover", // Ensure the image scales properly
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontWeight: "600",
    fontSize: 16,
  },
  placeAddress: {
    fontSize: 14,
    color: "#777",
  },
  placePhone: {
    fontSize: 14,
    color: "#444",
  },
  helpButton: {
    marginLeft: 8,
    padding: 4,
  },
  photoPreview: {
    padding: 8,
    marginLeft: 8,
  },
  searchtitle: {
    fontSize: 16,
    color: "#7a7a7a",
  },
  placeDescription: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
});

export default Dashboard;
