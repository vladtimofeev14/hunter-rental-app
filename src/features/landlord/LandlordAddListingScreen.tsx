import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { colors, sizes } from "../../styles/globalStyles";

type PropertyType = "Condo" | "House" | "Room";
type PricePeriod = "per day" | "per month";

export default function LandlordAddListingScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [sizeSqft, setSizeSqft] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [floor, setFloor] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [price, setPrice] = useState("");
  const [pricePeriod, setPricePeriod] = useState<PricePeriod | "">("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateRequiredFields = () => {
    const requiredFields = [
      name,
      address,
      city,
      description,
      sizeSqft,
      bedrooms,
      bathrooms,
      floor,
      propertyType,
      price,
      pricePeriod,
      image1,
      image2,
      image3,
    ];

    if (requiredFields.some((value) => !value.toString().trim())) {
      return "All fields are required.";
    }

    const numericFields = [
      { label: "Size", value: sizeSqft },
      { label: "Number of bedrooms", value: bedrooms },
      { label: "Number of bathrooms", value: bathrooms },
      { label: "Floor", value: floor },
      { label: "Price", value: price },
    ];

    const invalidField = numericFields.find(
      (field) => Number.isNaN(Number(field.value)) || Number(field.value) < 0
    );

    if (invalidField) {
      return `${invalidField.label} must be a valid number.`;
    }

    return null;
  };

  const handleCreateListing = async () => {
    const user = auth.currentUser;

    if (!user) {
      setError("User is not signed in.");
      return;
    }

    const validationError = validateRequiredFields();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const listing = {
        landlordID: user.uid,
        renterID: "",
        status: "Active",
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        description: description.trim(),
        sizeSqft: Number(sizeSqft),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        floor: Number(floor),
        propertyType,
        price: {
          amount: Number(price),
          period: pricePeriod,
        },
        images: [image1.trim(), image2.trim(), image3.trim()],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "listings"), listing);
      navigation.navigate("LandlordDashboard");
    } catch (e: any) {
      setError(e?.message || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  const renderOption = <T extends string>(
    value: T,
    selectedValue: T | "",
    onSelect: (value: T) => void
  ) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.option,
        selectedValue === value && styles.optionSelected,
      ]}
      onPress={() => onSelect(value)}
    >
      <Text
        style={[
          styles.optionText,
          selectedValue === value && styles.optionTextSelected,
        ]}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Listing</Text>

        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
        <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Size (sqft)"
          value={sizeSqft}
          onChangeText={setSizeSqft}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Number of bedrooms"
          value={bedrooms}
          onChangeText={setBedrooms}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Number of bathrooms"
          value={bathrooms}
          onChangeText={setBathrooms}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Floor"
          value={floor}
          onChangeText={setFloor}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Type of property</Text>
        <View style={styles.optionsRow}>
          {(["Condo", "House", "Room"] as PropertyType[]).map((value) =>
            renderOption(value, propertyType, setPropertyType)
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Price period</Text>
        <View style={styles.optionsRow}>
          {(["per day", "per month"] as PricePeriod[]).map((value) =>
            renderOption(value, pricePeriod, setPricePeriod)
          )}
        </View>

        <TextInput style={styles.input} placeholder="Image 1" value={image1} onChangeText={setImage1} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Image 2" value={image2} onChangeText={setImage2} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Image 3" value={image3} onChangeText={setImage3} autoCapitalize="none" />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateListing}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Create Listing"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: sizes.large,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: sizes.medium,
    fontWeight: "600",
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  optionSelected: {
    borderColor: colors.primaryBlue,
    backgroundColor: colors.lightBlueAccent,
  },
  optionText: {
    color: colors.black,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: colors.primaryBlue,
  },
  button: {
    backgroundColor: colors.primaryBlue,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
